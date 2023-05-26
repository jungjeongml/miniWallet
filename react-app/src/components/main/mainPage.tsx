import { MainHeader, Balance, MainContent, MainFooter } from "./components";
import { MainPageWrapper } from "./styled";

export const MainPage = () => {
  return (
    <>
      <MainPageWrapper>
        <MainHeader></MainHeader>
        <Balance></Balance>
        <MainContent></MainContent>
        <MainFooter></MainFooter>
      </MainPageWrapper>
    </>
  );
};
