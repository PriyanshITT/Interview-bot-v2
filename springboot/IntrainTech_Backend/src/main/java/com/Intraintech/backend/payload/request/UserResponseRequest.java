package com.Intraintech.backend.payload.request;




public class UserResponseRequest {

    private String name;
    private String username;
    private int totalMarks;

    public UserResponseRequest(String name, String username, int totalMarks) {
        this.name = name;
        this.username = username;
        this.totalMarks = totalMarks;
    }

    public String getName() {
        return name;
    }

    public String getUsername() {
        return username;
    }

    public int getTotalMarks() {
        return totalMarks;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setTotalMarks(int totalMarks) {
        this.totalMarks = totalMarks;
    }
}
