import styled from "styled-components";
export const LoadingWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  & > div {
    margin-bottom: 4rem;
  }
`;

export const TransmitButton = styled.button`
  width: 50%;
  background: none;
  border: 1px solid;
  padding: 5px;
  margin-top: 70px;
  border-radius: 30px;
  margin-left: 90px;
  color: pink;
`;

export const InputBox = styled.div`
  width: 100%;
  margin-top: 20px;
`;

export const Input = styled.input`
  cursor: pointer;
  width: 100%;
  height: 45px;
  border: none;
  border-radius: 40px;
`;
export const InfoText = styled.h3`
  width: 100%;
  color: pink;
`;
export const MainEventWrap = styled.div`
  width: 90%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

export const MainEventForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 400px;
`;
