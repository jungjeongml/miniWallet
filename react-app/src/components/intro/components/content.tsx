import { useAppDispatch } from "../../../store";
import { fetchAccount } from "../../../store/accountSlice";
import {
  CreateButton,
  AlreadyButton,
  ButtonWrapper,
} from "../styled/styled.introWrapper";

const Content = () => {
  const dispatch = useAppDispatch();

  return (
    <ButtonWrapper>
      <CreateButton onClick={() => dispatch(fetchAccount())}>
        Create new wallet
      </CreateButton>
      <AlreadyButton>I already have a wallet</AlreadyButton>
    </ButtonWrapper>
  );
};

export default Content;
