package com.lmcn.graphweb.Entity;

import java.util.Objects;

/**
 * This is the edge class for our graph
 *
 * Date: 2019.8.7
 * author: Mingchi Li
 */
public class Edge implements Comparable<Edge>{
    private Long id;
    private Vertex from;
    private Vertex to;
    private EdgeLabel label;

    /**
     * Constructor of the Edge class
     * @param from The starting point of the edge
     * @param to Edge termination point
     * @param label Edge label
     */
    public Edge(Long id, Vertex from, Vertex to, EdgeLabel label) {
        this.id = id;
        this.from = from;
        this.to = to;
        this.label = label;
    }

    /**
     * Get the vertex Id of this edge
     * @return current edge id
     */
    public Long getId() {
        return id;
    }

    /**
     * Get the vertex Id of current vertex
     * @return current vertex id
     */
    public Vertex getFrom() {
        return from;
    }

    /**
     * Get the vertex Id of this edge points to
     * @return dist vertex id
     */
    public Vertex getTo() {
        return to;
    }

    /**
     * Get the label of this edge
     * @return the label name
     */
    public EdgeLabel getLabel() {
        return label;
    }

    /**
     * If two edges have the same id, then these two edge are the same
     * @param o the other edge
     * @return Whether these two edges are equal
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Edge edge = (Edge) o;
        return Objects.equals(id, edge.id) ;
    }

    /**
     * The to string method
     * @return A string of current edge
     */
    @Override
    public String toString() {
        return from.getId() + "-" + label.getName() + "->" + to.getId();
    }

    /**
     * the hashCode method
     * @return the hash code
     */
    @Override
    public int hashCode() {
        return Objects.hash(from, to, label);
    }

    /**
     * Compare two edges by their edge label priority
     * @param o the other edge
     * @return the result
     */
    @Override
    public int compareTo(Edge o) {
        return 0;
    }
}
