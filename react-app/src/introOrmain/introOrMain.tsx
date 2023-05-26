import { Intro } from "../components/intro";
import { MainPage } from "../components/main";
import { useAppSelector } from "../store";

export const IntroOrMain = () => {
  const account = useAppSelector((state) => state.account.accounts);
  return <>{account.length === 0 ? <Intro></Intro> : <MainPage></MainPage>}</>;
};
