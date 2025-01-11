package org.springboot.websocket.webchat.Service;

public class Message {

    private String name;
    private String email;
    private String content;

    public Message(String name, String email, String content) {
        this.name = name;
        this.email = email;
        this.content = content;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
