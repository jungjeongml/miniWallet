import Header from "./components/Header";
import Content from "./components/content";
import { Phrase } from "./components/phrase";
import { IntroWrapper } from "./styled/styled.introWrapper";

export const Intro = () => {
  return (
    <>
      <IntroWrapper>
        <Header></Header>
        <Phrase></Phrase>
        <Content></Content>
      </IntroWrapper>
    </>
  );
};
