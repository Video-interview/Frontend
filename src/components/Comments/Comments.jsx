import { useState, useEffect } from "react";
import RootComment from "./RootComment";

import styled from "styled-components";
import commentApis from "../../apis/commentApis";
import GlobalButton from "../UI/GlobalButton";

const Comments = ({ cardId }) => {
  const [allComments, setAllComments] = useState([]);
  const [content, setContent] = useState("");
  const isTextareaDisabled = content.length === 0;

  useEffect(() => {
    commentApis.getComments(cardId).then((data) => {
      setAllComments(data.comments);
    });
  }, [cardId]);

  const sendCommentdataHandler = (data) => {
    setAllComments(data);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (isTextareaDisabled) {
      alert("내용을 작성해주세요.");
      return;
    }

    const data = { contents: content, rootId: cardId, rootName: "interview" };
    try {
      await commentApis.addComment(data);
      setContent("");
      try {
        const getDataResponse = await commentApis.getComments(cardId);
        setAllComments(getDataResponse.comments);
      } catch (err) {
        console.log("댓글 불러오기 오류", err);
      }
    } catch (err) {
      console.log("댓글 작성 오류", err);
    }
  };

  return (
    <CommentsContainer>
      <Form>
        <div className="textarea_box">
          <textarea
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 작성해주세요"
            maxLength={500}
            rows={5}
            value={content}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                onSubmitHandler();
              }
            }}
          ></textarea>
        </div>
        <div className="button_box">
          {isTextareaDisabled ? (
            <GlobalButton
              _width="70px"
              _height="15px"
              text="작성"
              onClick={onSubmitHandler}
            />
          ) : (
            <GlobalButton
              _width="70px"
              _height="15px"
              hover
              text="작성"
              onClick={onSubmitHandler}
            />
          )}
        </div>
      </Form>
      <div className="comments-container">
        {allComments?.map((rootComment) => {
          return (
            <RootComment
              key={rootComment.id}
              rootComment={rootComment}
              cardId={cardId}
              setAllComments={sendCommentdataHandler}
            />
          );
        })}
      </div>
    </CommentsContainer>
  );
};

const CommentsContainer = styled.div`
  font-size: 30px;
  margin-bottom: 20px;
  & .title {
    font-size: 16px;
  }

  & .comments-container {
  }
`;

const Form = styled.form`
  padding: 30px 0;
  & textarea {
    margin-top: 8px;
    padding: 11px 16px;
    border: 1px solid rgba(130, 130, 130, 0.2);
    border-radius: 4px;
    width: 100%;
  }
  & .textarea_box {
    padding-bottom: 10px;
  }
  & .button_box {
    display: flex;
    justify-content: flex-end;
    button {
      font-size: ${({ theme }) => theme.calRem(12)};
    }
  }
`;
export default Comments;