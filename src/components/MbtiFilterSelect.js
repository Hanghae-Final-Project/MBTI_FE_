import React, { useEffect, useState } from "react";
import styled from "styled-components";

//element
import Button03 from "../elements/Button03";

const MbtiFilterSelect = (props) => {
  const { parent } = props;

  const [ei, setEi] = useState([false, false]);
  const [sn, setSn] = useState([false, false]);
  const [tf, setTf] = useState([false, false]);
  const [jp, setJp] = useState([false, false]);

  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [third, setThird] = useState("");
  const [fourth, setFourth] = useState("");

  const user_mbti = first + second + third + fourth;

  useEffect(() => {
    parent(user_mbti);
  }, [first, second, third, fourth]);

  return (
    <Buttons>
      <Button03
        state={ei[0]}
        _onClick={() => {
          setEi([true, false]);
          setFirst("E");
        }}
        margin="0 0 20px 0"
      >
        E (외향)
      </Button03>
      <Button03
        state={ei[1]}
        _onClick={() => {
          setEi([false, true]);
          setFirst("I");
        }}
        margin="0 0 20px 0"
      >
        I (내향)
      </Button03>

      <Button03
        state={sn[0]}
        _onClick={() => {
          setSn([true, false]);
          setSecond("S");
        }}
        margin="0 0 20px 0"
      >
        S (감각)
      </Button03>
      <Button03
        state={sn[1]}
        _onClick={() => {
          setSn([false, true]);
          setSecond("N");
        }}
        margin="0 0 20px 0"
      >
        N (직관)
      </Button03>

      <Button03
        state={tf[0]}
        _onClick={() => {
          setTf([true, false]);
          setThird("T");
        }}
        margin="0 0 20px 0"
      >
        T (사고)
      </Button03>
      <Button03
        state={tf[1]}
        _onClick={() => {
          setTf([false, true]);
          setThird("F");
        }}
        margin="0 0 20px 0"
      >
        F (감정)
      </Button03>

      <Button03
        state={jp[0]}
        _onClick={() => {
          setJp([true, false]);
          setFourth("J");
        }}
        margin="0 0 20px 0"
      >
        J (판단)
      </Button03>
      <Button03
        state={jp[1]}
        _onClick={() => {
          setJp([false, true]);
          setFourth("P");
        }}
        margin="0 0 20px 0"
      >
        P (인식)
      </Button03>
    </Buttons>
  );
};

const Buttons = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
`;

export default MbtiFilterSelect;
