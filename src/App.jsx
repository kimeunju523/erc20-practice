import { useSDK } from "@metamask/sdk-react";
import { useEffect, useState } from "react";
import Web3 from "web3";
import TokenCard from "./components/TokenCard";
import contractAddress from "./contractAddress.json";

const App = () => {
  const [account, setAccont] = useState("");
  const [web3, setWeb3] = useState();

  const { sdk, provider } = useSDK();

  const onClickMetaMask = async () => {
    try {
      const accounts = await sdk?.connect();

      setAccont(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!provider) return;

    setWeb3(new Web3(provider));
  }, [provider]);

  return (
    <div className=" flex flex-col justify-center items-center">
      {account ? (
        <>
          <div>
            Hello,{account.substring(0, 7)}...
            {account.substring(account.length - 5)}
          </div>
          <button
            className="mt-4 mb-4 rounded-full w-[12rem] bg-gray-700 text-white"
            onClick={() => setAccont("")}
          >
            🦊 MetaMask Logout
          </button>
          {contractAddress.map((v, i) => (
            <TokenCard
              className="border:5px solid black"
              key={i}
              account={account}
              web3={web3}
              address={v.address}
              owner={v.owner}
              walletAccount={v.walletAccount}
            />
          ))}
        </>
      ) : (
        <button onClick={onClickMetaMask}>🦊 MetaMask Login</button>
      )}
    </div>
  );
};

export default App;
