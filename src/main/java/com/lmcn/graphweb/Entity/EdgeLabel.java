package com.lmcn.graphweb.Entity;

import java.util.Objects;

/**
 * This is the edge label class
 *
 * author: Mingchi Li
 * date: 2019.8.14
 */
public class EdgeLabel implements Comparable<EdgeLabel>{
    private String name;
    private Long priority;
    private String prefix;
    private String postfix;

    /**
     * The constructor of this class
     * @param name the label name of this edge label
     */
    public EdgeLabel(String name) {
        this.name = name;
        this.priority = Long.MAX_VALUE;
        this.prefix = "";
        this.postfix = "";
    }

    /**
     * The constructor of this class with two parameters
     * @param name the label name of this edge label
     * @param priority the label priority of this edge label
     */
    public EdgeLabel(String name, Long priority) {
        this.name = name;
        this.priority = priority;
        this.prefix = "";
        this.postfix = "";
    }

    /**
     * The constructor of this class with three parameters
     * @param name the label name of this edge label
     * @param priority the label priority of this edge label
     * @param prefix the label prefix of this edge label
     */
    public EdgeLabel(String name, Long priority, String prefix) {
        this.name = name;
        this.priority = priority;
        this.prefix = prefix;
        this.postfix = "";
    }

    /**
     * The constructor of this class with four parameters
     * @param name the label name of this edge label
     * @param priority the label priority of this edge label
     * @param prefix the label prefix of this edge label
     * @param postfix the label postfix of this edge label
     */
    public EdgeLabel(String name, Long priority, String prefix, String postfix) {
        this.name = name;
        this.priority = priority;
        this.prefix = prefix;
        this.postfix = postfix;
    }

    /**
     * Get the print priority of this label
     * @param priority
     */
    public void setPriority(Long priority) {
        this.priority = priority;
    }

    /**
     * set it's prefix string for printing
     * @param prefix the string before the label name
     */
    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

    /**
     * set it's postfix string for printing
     * @param postfix the string after the label name
     */
    public void setPostfix(String postfix) {
        this.postfix = postfix;
    }

    /**
     * Get the label name
     * @return the name of this label
     */
    public String getName() {
        return name;
    }

    /**
     * get the priority of this edge label
     * @return the priority value of this label
     */
    public Long getPriority() {
        return priority;
    }

    /**
     * Override the origin equals method
     * @param o the other object need to be compared with this one
     * @return is those two object equal
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EdgeLabel edgeLabel = (EdgeLabel) o;
        return name.equals(edgeLabel.getName());
    }

    /**
     * Override the origin hashCode method
     * @return the hash value of this edge
     */
    @Override
    public int hashCode() {
        return Objects.hash(name);
    }

    /**
     * Override the compareTo method
     * @param o the other edge label
     * @return the result
     */
    @Override
    public int compareTo(EdgeLabel o) {
        if (priority.compareTo(o.getPriority()) != 0)
            return priority.compareTo(o.getPriority());
        else return name.compareTo(o.getName());
    }

    /**
     * combine prefix name and post together to a new string
     * @return the new string
     */
    @Override
    public String toString() {
        return "{name:" + name + ", priority:" + priority + "}";
    }

    /**
     * print the label with it's prefix and postfix
     * @return string of this label
     */
    public String print(){
        if (postfix.equals("") && prefix.equals(""))
            return " " + name + " ";
        else if (prefix.equals(""))
            return name + " " + postfix+ " ";
        else if (postfix.equals(""))
            return " " + prefix + " " + name;
        else
            return " " + prefix + " " + name + " " + postfix+ " ";
    }
}
