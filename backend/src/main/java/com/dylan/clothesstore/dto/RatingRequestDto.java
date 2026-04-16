package com.dylan.clothesstore.dto;

public class RatingRequestDto {

    private int score;
    private String comment;

    public RatingRequestDto() {
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}