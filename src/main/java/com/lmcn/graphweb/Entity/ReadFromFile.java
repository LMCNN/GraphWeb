package com.lmcn.graphweb.Entity;

import java.io.*;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.*;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

/**
 * Read Graph data from file
 *
 * author: Mingchi Li
 * date: 2019.8.8
 */
public class ReadFromFile {
    //Load json configuration file
    public static void loadConfig(String config, Digraph dg) throws IOException, ParseException {
        // parsing file "config.json"
        Object obj = new JSONParser().parse(new FileReader(config));

        // typecasting obj to JSONObject
        JSONObject jo = (JSONObject) obj;

        // getting VertexLabel
        JSONArray jv = (JSONArray) jo.get("VertexLabel");
        // iterating vertex label
        Iterator itr = jv.iterator();
        Map<String, VertexLabel> tempMapV = new HashMap<>();
        while (itr.hasNext())
        {
            JSONObject tempV = (JSONObject) itr.next();
            String name = (String) tempV.get("name");
            Long priority = (Long) tempV.get("priority");
            VertexLabel tempLabel = new VertexLabel(name, priority);
            tempMapV.put(name, tempLabel);
        }
        dg.setVertexLabelMap(tempMapV);

        // getting EdgeLabel
        JSONArray je = (JSONArray) jo.get("EdgeLabel");
        Map<String, EdgeLabel> tempMapE = new HashMap<>();
        itr = je.iterator();
        while (itr.hasNext())
        {
            JSONObject tempE = (JSONObject) itr.next();
            String name = (String) tempE.get("name");
            Long priority = (Long) tempE.get("priority");
            String prefix = (String) tempE.get("prefix");
            String postfix = (String) tempE.get("postfix");
            EdgeLabel tempLabel = new EdgeLabel(name, priority, prefix, postfix);
            tempMapE.put(name, tempLabel);
        }
        dg.setEdgeLabelMap(tempMapE);
    }

    //This function can parse .e .v file and convert them into a Digraph object
    public static Digraph ReadFromCSV(String vFileName, String eFileName, Digraph dg){
        File vFile = new File(vFileName);
        BufferedReader reader = null;
        try {
            Map<String, VertexLabel> vLabelMap;
            if (dg.getVertexLabelMap() == null){
                vLabelMap = new HashMap<>();
                dg.setVertexLabelMap(vLabelMap);
            }
            else {
                vLabelMap = dg.getVertexLabelMap();
            }
            reader = new BufferedReader(new FileReader(vFile));
            String temp = null;
            while ((temp = reader.readLine()) != null) {
                String[] line = temp.split(",");
                for (int i = 0; i < line.length; i++){
                    System.out.print(line[i] + " ");
                }
                if (!vLabelMap.containsKey(line[1])) vLabelMap.put(line[1], new VertexLabel(line[1]));
                dg.addVertexToMap(new Vertex(Long.valueOf(line[0]), dg.getVertexLabelByName(line[1]), line[2]));
                System.out.println();
            }
            reader.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        System.out.println("\n-------------------------------------------\n");

        File eFile = new File(eFileName);
        reader = null;
        try {
            Map<String, EdgeLabel> eLabelMap;
            if (dg.getEdgeLabelMap() == null){
                eLabelMap = new HashMap<>();
                dg.setEdgeLabelMap(eLabelMap);
            }
            else {
                eLabelMap = dg.getEdgeLabelMap();
            }
            reader = new BufferedReader(new FileReader(eFile));
            String temp = null;
            while ((temp = reader.readLine()) != null) {
                String[] line = temp.split(",");
                for (int i = 0; i < line.length; i++){
                    System.out.print(line[i] + " ");
                }
                if (!eLabelMap.containsKey(line[3])) eLabelMap.put(line[3], new EdgeLabel(line[3]));
                dg.addEdge(new Edge(Long.valueOf(line[0]),
                        dg.getVertexById(Long.valueOf(line[1])),
                        dg.getVertexById(Long.valueOf(line[2])),
                        dg.getEdgeLabelByName(line[3])));
                System.out.println();
            }
            reader.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return dg;
    }

    //Load from .gexf file to a Digraph object
    public static Digraph parseGEXF(String fileName, Digraph dg){
        File inputFile = new File(fileName);
        DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();

        try {
            DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
            Document doc = dBuilder.parse(inputFile);
            doc.getDocumentElement().normalize();

            //Parse label configuration and attributes
            NodeList vLabelList = null;
            NodeList eLabelList = null;
            NodeList aList = null;
            NodeList acList = doc.getElementsByTagName("attributes");
            for (int i = 0; i < acList.getLength(); i++){
                Node acNode = acList.item(i);
                if (acNode.getNodeType() == Node.ELEMENT_NODE) {
                    Element acElement = (Element) acNode;
                    String c = acElement.getAttribute("class");
                    if (c.equals("vertexLabel")){
                        vLabelList = acElement.getElementsByTagName("attribute");
                    }
                    if (c.equals("edgeLabel")){
                        eLabelList = acElement.getElementsByTagName("attribute");
                    }
                    if (c.equals("node")){
                        aList = acElement.getElementsByTagName("attribute");
                    }
                }
            }

            //load vertex label map to dg
            if (vLabelList != null){
                Map<String, VertexLabel> tempMapV;
                if (dg.getVertexLabelMap() == null){
                    tempMapV = new HashMap<>();
                }
                else {
                    tempMapV = dg.getVertexLabelMap();
                }
                for (int i = 0; i < vLabelList.getLength(); i++){
                    Node vlNode = vLabelList.item(i);
                    if (vlNode.getNodeType() == Node.ELEMENT_NODE){
                        Element vlElement = (Element) vlNode;
                        String name = vlElement.getAttribute("name");
                        Long priority = Long.valueOf(vlElement.getAttribute("priority"));
                        if (!tempMapV.containsKey(name)) tempMapV.put(name, new VertexLabel(name, priority));
                    }
                }
                dg.setVertexLabelMap(tempMapV);
            }

            //load edge label map to dg
            if (eLabelList != null){
                Map<String, EdgeLabel> tempMapE;
                if (dg.getEdgeLabelMap() == null){
                    tempMapE = new HashMap<>();
                }
                else {
                    tempMapE = dg.getEdgeLabelMap();
                }
                for (int i = 0; i < eLabelList.getLength(); i++){
                    Node elNode = eLabelList.item(i);
                    if (elNode.getNodeType() == Node.ELEMENT_NODE){
                        Element elElement = (Element) elNode;
                        String name = elElement.getAttribute("name");
                        Long priority = Long.valueOf(elElement.getAttribute("priority"));
                        String prefix =  elElement.getAttribute("prefix");
                        String postfix =  elElement.getAttribute("postfix");
                        if(!tempMapE.containsKey(name)) tempMapE.put(name, new EdgeLabel(name, priority, prefix, postfix));
                    }
                }
                dg.setEdgeLabelMap(tempMapE);
            }

            //Parse attributes and store them to a map
            Map<Long, String> aMap = new HashMap<>();
            for (int i = 0; i < aList.getLength(); i++){
                Node nNode = aList.item(i);
                if (nNode.getNodeType() == Node.ELEMENT_NODE) {
                    Element eElement = (Element) nNode;
                    Long id = Long.valueOf( eElement.getAttribute("id"));
                    String title = eElement.getAttribute("title");
                    aMap.put(id, title);
                }
            }

            //Parse Vertices and add them to the graph object
            NodeList nList = doc.getElementsByTagName("node");
            Vertex tempV;
            Map<String, VertexLabel> vLabelMap;
            if (dg.getVertexLabelMap() == null){
                vLabelMap = new HashMap<>();
                dg.setVertexLabelMap(vLabelMap);
            }
            else {
                vLabelMap = dg.getVertexLabelMap();
            }
            for (int i = 0; i < nList.getLength(); i++) {
                Node nNode = nList.item(i);
                if (nNode.getNodeType() == Node.ELEMENT_NODE) {
                    Element eElement = (Element) nNode;
                    Long id = Long.valueOf( eElement.getAttribute("id"));
                    String label = eElement.getAttribute("label");
                    if (!vLabelMap.containsKey(label)) vLabelMap.put(label, new VertexLabel(label));
                    tempV = new Vertex(id, dg.getVertexLabelByName(label));

                    //Set attributes to current vertex
                    NodeList attList = eElement.getElementsByTagName("attvalue");
                    for (int j = 0; j < attList.getLength(); j++){
                        Node aNode = attList.item(j);
                        if (aNode.getNodeType() == Node.ELEMENT_NODE){
                            Element aElement = (Element) aNode;
                            String attKey = aMap.get(Long.valueOf(aElement.getAttribute("for")));
                            String attValue = aElement.getAttribute("value");
                            if (attKey.equals("name")) tempV.setName(attValue);
                            else {
                                tempV.putAttribute(attKey, attValue);
                            }
                        }
                    }
                    dg.addVertexToMap(tempV);
                }
            }

            //Parse Edges and add them to the graph object
            NodeList eList = doc.getElementsByTagName("edge");
            Map<String, EdgeLabel> eLabelMap;
            if (dg.getEdgeLabelMap() == null){
                eLabelMap = new HashMap<>();
                dg.setEdgeLabelMap(eLabelMap);
            }
            else {
                eLabelMap = dg.getEdgeLabelMap();
            }
            for (int i = 0; i < eList.getLength(); i++) {
                Node eNode = eList.item(i);
                if (eNode.getNodeType() == Node.ELEMENT_NODE) {
                    Element eElement = (Element) eNode;
                    Long id = Long.valueOf(eElement.getAttribute("id"));
                    Vertex from = dg.getVertexById(Long.valueOf(eElement.getAttribute("source")));
                    Vertex to = dg.getVertexById(Long.valueOf(eElement.getAttribute("target")));
                    String label = eElement.getAttribute("label");
                    if (!eLabelMap.containsKey(label)) eLabelMap.put(label, new EdgeLabel(label));
                    dg.addEdge(new Edge(id, from, to, dg.getEdgeLabelByName(label)));
                }
            }
        }
        catch (Exception e){
            e.printStackTrace();
        }
        return dg;
    }
}
