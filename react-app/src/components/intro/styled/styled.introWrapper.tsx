import styled from "styled-components";

export const IntroWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin: 0 auto;
  position: relative;
`;

export const WelcomePhrase = styled.h2`
  color: pink;
  position: absolute;
`;

export const CreateButton = styled.button`
  background: none;
  border: 0;
  padding: 30px;
  margin: 0;
  background: pink;
  border-radius: 40px;
  width: 400px;
  font-weight: bold;
`;
export const AlreadyButton = styled.button`
  background: none;
  border: 0;
  padding: 30px;
  margin: 5px 0 0 0;
  background: pink;
  border-radius: 40px;
  width: 400px;
  font-weight: bold;
`;
export const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: black;
  margin-top: 200px;
  margin-bottom: 20px;
`;
