import { useState, useEffect } from "react";
import mintTokenAbi from "../mintTokenAbi.json";
import OptionCard from "./OptionCard";
import contractAddress from "../contractAddress.json";

const TokenCard = ({ account, web3, address, owner, walletAccount }) => {
  const [name, setName] = useState("TOKEN");
  const [symbol, setSymbol] = useState("SYMBOL");
  const [balance, setBalance] = useState(0);
  const [contract, setContract] = useState();
  const [inputAccount, setInputAccount] = useState("");
  const [inputValue, setInputValue] = useState(0);

  const getName = async () => {
    try {
      const response = await contract.methods.name().call();
      setName(response);
    } catch (error) {
      console.error(error);
    }
  };

  const getSymbol = async () => {
    try {
      const response = await contract.methods.symbol().call();
      setSymbol(response);
    } catch (error) {
      console.error(error);
    }
  };

  const getBalanceOf = async () => {
    try {
      const response = await contract.methods.balanceOf(account).call();

      setBalance(web3.utils.fromWei(response, "ether"));
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmitSend = async (e) => {
    try {
      e.preventDefault();

      await contract.methods
        .transfer(inputAccount, web3.utils.toWei(inputValue, "ether"))
        .send({ from: account });

      getBalanceOf();

      setInputAccount("");
      setInputValue();
      alert("성공적으로 토큰을 전송하였습니다.");
    } catch (error) {
      console.error(error);
    }
  };

  const onClickClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(walletAccount);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!contract || !account) return;

    getName();
    getSymbol();
    getBalanceOf();
  }, [contract, account]);

  useEffect(() => {
    if (!web3) return;

    setContract(new web3.eth.Contract(mintTokenAbi, address));
  }, [web3]);

  return (
    <>
      <div className="mt-4 w-[25rem] flex flex-col items-center justify-center  bg-lime-200">
        <button onClick={onClickClipBoard}>{owner} 발행코인</button>
      </div>
      <div>
        <span className=" flex flex-col items-center w-[25rem] bg-lime-100">
          {symbol} 코인
        </span>
        <span className="flex flex-col items-center w-[25rem] bg-lime-100">
          잔액 {balance}
        </span>
        <span className="flex flex-col items-center w-[25rem] bg-lime-100">
          (코인명 {name})
        </span>
        <form className="flex items-center" onSubmit={onSubmitSend}>
          {/*<div className="flex w-[22rem]">
            <input
              className="bg-red-100"
              type="text"
              value={inputAccount}
              onChange={(e) => setInputAccount(e.target.value)}
  />*/}
          <select
            value={inputAccount}
            onChange={(e) => setInputAccount(e.target.value)}
          >
            <option value=""></option>
            {contractAddress.map((v, i) => (
              <OptionCard
                key={i}
                owner={v.owner}
                walletAccount={v.walletAccount}
              />
            ))}
          </select>

          <input
            className="bg-blue-100 "
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          <button
            className="rounded-full bg-lime-400  items-center"
            type="submit"
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
};

export default TokenCard;
