import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userInfoDB } from "../redux/modules/userInfo";
import { actionCreators as chatActions } from "../redux/modules/chat";
import { chatApi } from "../shared/api";
import Swal from "sweetalert2";

import "../css/component.css";
import ProfileSwiper from "../components/myprofile/ProfileSwiper";
import Button01 from "../elements/Button01";
import { ReactComponent as BlockSvg } from "../images/icons/flag.svg";

const ChatProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // 내 정보
  const token = sessionStorage.getItem("is_login");
  const userNum = sessionStorage.getItem("userNum");
  const loginUser = useSelector((state) => state.userInfo.user);

  // 프로필 사용자 정보
  const data = location.state.data;
  console.log(data);

  // 페이지에 따른 채팅 프로필 구분
  const from = location.state.from;

  // 차단 상태
  const [activeBlock, setActiveBlock] = useState();

  // 유저 나이 구하기
  const birthday = data.birthday && data.birthday.slice(0, 4);
  const today = new Date();
  const user_age = today.getFullYear() - birthday + 1;

  useEffect(() => {
    if (token) {
      dispatch(userInfoDB(userNum));
    }
  }, []);

  useEffect(() => {
    if (loginUser.length !== 0 && loginUser.blockedUsers.includes(data.userNum))
      setActiveBlock(1);
  }, [loginUser]);

  // 1:1 대화하기 (방 생성)
  const createRoom = async () => {
    if (token) {
      await chatApi
        .createRoom(data.userNum)
        .then((res) => {
          navigate("/chat", {
            state: { data: data, room: res.data.Room },
          });
        })
        .catch((err) => {
          if (err.response.data.blocked === "blocked") {
            Swal.fire("차단 상태", "채팅방 생성이 불가합니다.", "error");
          } else {
            navigate("/chat", {
              state: { data: data, room: err.response.data.Room },
            });
          }
        });
    } else Swal.fire("1:1 채팅하기", "로그인을 해주세요!", "warning");
  };

  // 유저 차단하기
  const blockUser = () => {
    if (!token) {
      Swal.fire("사용자 차단하기", "로그인을 해주세요!", "warning");
      return;
    }

    if (!activeBlock) {
      dispatch(chatActions.blockUserAC(data.userNum));
      if (from === "chatarea") {
        alert("상대방을 차단하여 채팅방에서 대화하실 수 없습니다.");
        navigate("/chatlist");
      }
    } else {
      dispatch(chatActions.unblockUserAC(data.userNum));
    }
    setActiveBlock(!activeBlock);
  };

  return (
    <ChatProfileWrap>
      <ProfileImageWrap className="contents-container">
        {data.profileImages === undefined || data.profileImages.length === 0 ? (
          <img src={data.userImage[0]} alt="user" />
        ) : data.profileImages.length === 1 ? (
          <img src={data.profileImages} alt="profile" />
        ) : (
          <ProfileSwiper images={data.profileImages} />
        )}
      </ProfileImageWrap>

      <ProfileInfoWrap className="container">
        <User>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyItems: "center",
            }}
          >
            <div>{data.nickname}</div>
            <span>{user_age}</span>
          </div>
          {Number(data.userNum) !== Number(userNum) ? (
            <BlockSvg
              style={{ fill: activeBlock ? "#ff6565" : "#adadad" }}
              onClick={blockUser}
            />
          ) : null}
        </User>
        <MBTI>{data.mbti}</MBTI>
        <Introduction>
          <h3>자기소개</h3>
          <div>{data.introduction}</div>
        </Introduction>
      </ProfileInfoWrap>

      {from === "chat" || Number(data.userNum) === Number(userNum) ? (
        <div style={{ height: "52px" }} />
      ) : (
        <div
          className="container"
          onClick={createRoom}
          style={{ width: "100%" }}
        >
          <Button01
            backgroundColor="var(--maincolor)"
            color="#fff"
            margin="0 0 60px 0"
          >
            대화하기
          </Button01>
        </div>
      )}
    </ChatProfileWrap>
  );
};

const ChatProfileWrap = styled.div`
  letter-spacing: -0.05em;
  width: 100%;
  background-color: white;
`;

const ProfileImageWrap = styled.div`
  width: 100%;

  & img {
    width: 100%;
    border-radius: 4px;
  }
`;

const ProfileInfoWrap = styled.div`
  text-align: left;
  margin: 20px 0 40px 0;
  width: 100%;
`;

const User = styled.div`
  font-weight: 700;
  font-size: 26px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  & span {
    font-size: 22px;
    font-weight: 400;
    margin-left: 7px;
  }
`;

const MBTI = styled.div`
  color: var(--maincolor);
  width: 60px;
  border: 1px solid var(--maincolor);
  border-radius: 30px;
  font-weight: 500;
  font-size: 16px;
  margin: 8px 0 32px 0;
  text-align: center;
`;

const Introduction = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
`;

export default ChatProfile;
