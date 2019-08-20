package com.lmcn.graphweb.Entity;

import java.util.*;

/**
 *  This is the Direct Graph class
 *
 *  author: Mingchi Li
 *  date 2019.8.8
 */
public class Digraph {
    private Map<Long, Vertex> vertexMap;
    private List<Vertex> outVertices;
    private Map<String, EdgeLabel> edgeLabelMap;
    private Map<String, VertexLabel> vertexLabelMap;

    /**
     * The constructor of this class
     */
    public Digraph() {
        this.vertexMap = new HashMap<Long, Vertex>();
        this.outVertices = new ArrayList<Vertex>();
    }

    /**
     * Load edgeLabelMap from configuration file
     * @param edgeLabelMap map create by config file
     */
    public void setEdgeLabelMap(Map<String, EdgeLabel> edgeLabelMap) {
        this.edgeLabelMap = edgeLabelMap;
    }

    /**
     * Load vertexLabelMap from configuration file
     * @param vertexLabelMap map create by config file
     */
    public void setVertexLabelMap(Map<String, VertexLabel> vertexLabelMap) {
        this.vertexLabelMap = vertexLabelMap;
    }

    /**
     * Put a vertex into the map
     * @param v the vertex need to be put
     * @return this vertex
     */
    public Vertex addVertexToMap(Vertex v){
        vertexMap.put(v.getId(), v);
        return v;
    }

    /**
     * Get all vertices with our degree greater than 0
     * @return a list of vertex
     */
    public List<Vertex> getOutVertices() {
        updateOut();
        return outVertices;
    }

    /**
     * Get a vertex from map by its id
     * @param id the id of this vertex
     * @return the vertex needed
     */
    public Vertex getVertexById(Long id){
        return this.vertexMap.get(id);
    }

    /**
     * get the vertex label map
     * @return vertex label map
     */
    public Map<String, VertexLabel> getVertexLabelMap() {
        return vertexLabelMap;
    }

    /**
     * Get the edge label map
     * @return edge label map
     */
    public Map<String, EdgeLabel> getEdgeLabelMap() {
        return edgeLabelMap;
    }

    /**
     * Get the vertex label object by its name
     * @param name the name of vertex label
     * @return the vertex label
     */
    public VertexLabel getVertexLabelByName(String name){
        return vertexLabelMap.get(name);
    }

    /**
     * Get the edge label object by it name
     * @param name the name of edge label
     * @return the edge label
     */
    public EdgeLabel getEdgeLabelByName(String name){
        return edgeLabelMap.get(name);
    }

    /**
     * Update the out vertex list
     */
    private void updateOut(){
        Collection<Vertex> vertices = vertexMap.values();
        for (Vertex curr : vertices) {
            if (curr.getOutDegree() > 0 && !outVertices.contains(curr))
                outVertices.add(curr);
        }
        Collections.sort(outVertices);
    }

    /**
     * Add a edge to the graph
     * @param e the edge need to be added
     * @return this edge
     */
    public Edge addEdge(Edge e){
        Vertex fromV = e.getFrom();
        Vertex currV = getVertexById(fromV.getId());
        currV.addEdge(e);
        return e;
    }

    /**
     * The toString method
     * @return the String contain all information of this digraph
     */
    @Override
    public String toString() {
        return "Digraph{" +
                "\nvertexMap=" + vertexMap + ",\n " +
                printOutVertices() +
                ",\n edgeLabelMap=" + edgeLabelMap +
                ",\n vertexLabelMap=" + vertexLabelMap +
                "\n}";
    }

    /**
     * helper method for print the out vertices
     * @return A out vertices string
     */
    private String printOutVertices(){
        StringBuilder builder = new StringBuilder("outVertices = {");
        for (Vertex curr : outVertices){
            builder.append(curr.getId());
            builder.append(", ");
        }
        builder.append("}");
        return builder.toString();
    }

    /**
     * helper method for Describe
     */
    private void printEnglish(Integer size){
        System.out.print("\nWe are going to describe " + size);
        if (size == 1){
            System.out.println(" vertex:");
        }
        else {
            System.out.println(" vertices:");
        }
    }

    /**
     * helper method for Describe
     */
    private void printChinese(Integer size){
        System.out.println("\n将要描述" + size + "个节点：");
    }

    private void printVertices(Vertex vertex, Integer size){
        if (size != 1) System.out.print(vertex.getLabel().print() + ": " + vertex.getName());
        else System.out.print(vertex.getName());
    }
    /**
     * Describe this graph using english
     */
    public void describe(Character language) {
        updateOut();
        Integer numOut = outVertices.size();
        if (language == 'z') printChinese(numOut);
        if (language == 'e') printEnglish(numOut);

        for (Vertex currV : outVertices){
            System.out.println("--------------------------------------------------------");

            for (EdgeLabel label : currV.getEdgeMap().keySet()){
                List<Edge> edgeList = currV.getEdgeMap().get(label);
                System.out.print(currV.getLabel().getName() + ": " + currV.print() + label.print());

                if (edgeList.size() > 1) System.out.print("[");
                Iterator<Edge> iterator = edgeList.iterator();
                while (iterator.hasNext()){
                    Vertex distV = vertexMap.get(iterator.next().getTo().getId());
                    printVertices(distV, edgeList.size());
                    if (iterator.hasNext()) System.out.print("; ");
                }
                if (edgeList.size() > 1) System.out.println("]");
                else System.out.println();
            }
        }
    }
}
