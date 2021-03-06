export type SubjectType = "TextPost" | "ImagePost" | "VideoPost" | "LinkPost" | "Comment" | "Page" | "Reactions"

export const SUBJECT_TYPE = {
    TextPost: "TextPost" as SubjectType,
    ImagePost: "ImagePost" as SubjectType,
    VideoPost: "VideoPost" as SubjectType,
    LinkPost: "LinkPost" as SubjectType,
    Comment: "Comment" as SubjectType,
    Page: "Page" as SubjectType,
    Reactions: "Reactions" as SubjectType
};
