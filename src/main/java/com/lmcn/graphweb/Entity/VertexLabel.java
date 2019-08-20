package com.lmcn.graphweb.Entity;

import java.util.Objects;

/**
 * This this the VertexLabel class
 *
 * author: Mingchi Li
 * date: 2019.8.14
 */
public class VertexLabel implements Comparable<VertexLabel>{
    private String name;
    private Long priority;

    /**
     * The constructor of this class
     * @param name the name of this vertex
     */
    public VertexLabel(String name) {
        this.name = name;
        this.priority = Long.MAX_VALUE;
    }

    /**
     * The constructor of this class with two parameters
     * @param name the name of this vertex label
     * @param priority the priority of this vertex label
     */
    public VertexLabel(String name, Long priority) {
        this.name = name;
        this.priority = priority;
    }

    /**
     * Set the priority of this label type of vertex
     * @param priority the priority
     */
    public void setPriority(Long priority) {
        this.priority = priority;
    }

    /**
     * Get the label name of this vertex
     * @return
     */
    public String getName() {
        return name;
    }

    /**
     * Get the priority of this vertex
     * @return
     */
    public Long getPriority() {
        return priority;
    }

    /**
     * Override the compareTo method
     * @param o the other VertexLabel object
     * @return the result
     */
    @Override
    public int compareTo(VertexLabel o) {
        return this.priority.compareTo(o.getPriority());
    }

    /**
     * The toString method
     * @return a String contains the label name and it's priority
     */
    @Override
    public String toString() {
        return "{name:" + name + ", priority:" + priority + "}";
    }

    /**
     * print the label name
     * @return a string contains the label name
     */
    public String print(){
        return name;
    }

    /**
     * the equals method
     * @param o the other vertex
     * @return the result
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        VertexLabel that = (VertexLabel) o;
        return Objects.equals(name, that.name);
    }

    /**
     * the hashCode method
     * @return hash value of the label name
     */
    @Override
    public int hashCode() {
        return Objects.hash(name);
    }
}
