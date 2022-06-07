import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import Moralis from "moralis";
import { contractABI, contractAddress } from "../../contract";
import Web3 from "web3";


const web3 = new Web3(Web3.givenProvider);

function Dashboard() {
  const { isAuthenticated, logout, user } = useMoralis();
  const [_name, setName] = useState("");
  const [_description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const name = _name.trim();
  const description = _description.trim();



  let img = ['https://imgs.search.brave.com/yyEXW1Pa0w3AE21swQ4ndtYGle7auEyDowxWzBUtTlQ/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9leHRl/cm5hbC1wcmV2aWV3/LnJlZGQuaXQvbll2/SmZjblNzejhURlph/R2RLS0dhVkpxQ09i/U0ZTMzg3djYtNkZ2/MXpiOC5qcGc_YXV0/bz13ZWJwJnM9YTk0/MTk1YTQwOWVjMWRi/MDlkNjBhZDJkZTdk/MDM3YzI0NmY5MDUx/OQ', 'https://imgs.search.brave.com/BNeR3UwPn7ARcre43e9wRuOgzMD2MZfOrqbGCQmDk54/rs:fit:563:225:1/g:ce/aHR0cHM6Ly90c2Ux/Lm1tLmJpbmcubmV0/L3RoP2lkPU9JUC5l/Y3VDX3ZkOVg0SGtC/RzNRRU02MTRRSGFH/UCZwaWQ9QXBp', 'https://imgs.search.brave.com/OnDhJ9MNRqk5z4T03Do8OVumlTxYNixhv-JlJUIMHEw/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9wY2h0/ZWNobm9sb2dpZXMu/Y29tL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDIwLzA4L0NvbW1v/bi1TaWducy1vZi1h/LUNvbXB1dGVyLUhh/Y2stYW5kLUhvdy10/by1QcmV2ZW50LUl0/LmpwZw'];






  let index = Math.floor(Math.random() * img.length);
  let selected_img = img[index];





  console.log(selected_img);

  const onSubmit = async (e) => {

    setIsLoading(true);
    e.preventDefault();

    try {




      alert('wait 10 or more sec because the blockchain is a bit slow');

      // These will be retrieved from a list of mintable NFTs, coming from a server/table
      const fileUrl = selected_img;
      const fileValue = "10000000000000000"; // Wei --> 0.01 ETH

      // Generate metadata and save to IPFS
      const metadata = {
        name,
        description,
        image: fileUrl,
      };

      const file = new Moralis.File(`${name}metadata.json`, {
        base64: Buffer.from(JSON.stringify(metadata)).toString("base64"),
      });
      await file.saveIPFS();
      const metadataurl = file.ipfs();

      // Interact with smart contract
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const response = await contract.methods
        .mint(metadataurl)
        .send({ from: user.get("ethAddress"), value: fileValue });

      // Get token id
      const tokenSendEthId = response.events.Transfer.returnValues.tokenId;

      // const sendEth = async () => {
      //   try {
      //     await Moralis.Web3.enableWeb3();
      //     const result = await Moralis.Web3.transfer({
      //       type: "native",
      //       amount: Moralis.Units.ETH("0.1"),
      //       receiver: "account not connected with the app",
      //     });
      //     console.log(result);
      //     alert("Transfer of funds succeeded!");
      //   } catch (err) {
      //     console.error(err);
      //     alert("Something went wrong");
      //   }
      // };

      // Display alert
      alert(
        `NFT successfully minted. Contract address - ${contractAddress} and Token ID - ${tokenSendEthId}`
      );


    } catch (err) {
      console.error(err);
      alert("An error occured!");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isAuthenticated) router.replace("/");
  }, [isAuthenticated]);

  return (
    <div className="flex w-screen h-screen items-center justify-center p-10">
      {isLoading &&
        <div className="absolute bg-white bg-opacity-60 z-10 h-full w-full flex items-center justify-center">
          <div className="flex items-center">
            <span className="text-3xl mr-4">Loading</span>
            <svg className="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
          </div>
        </div>
      }
      <form onSubmit={onSubmit}>
        <div>
          <button className="flex justify-left">

            <img src="https://imgs.search.brave.com/W63rDUMxUMiWOiqveGKz7_aYwNjisc9JL8MNbXRy7tc/rs:fit:980:980:1/g:ce/aHR0cDovL2Nkbi5v/bmxpbmV3ZWJmb250/cy5jb20vc3ZnL2lt/Z18yMTUwNTkucG5n" className="w-10 h-45"></img>


          </button>
          <h2 className="text-red-100 pt-2 flex items-center jusify-center">{contractAddress}</h2>
          <input
            type="text"
            className="border-[1px] p-2 text-lg border-black w-full"
            value={name}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mt-3">
          <input
            type="text"
            className="border-[1px] p-2 text-lg border-black w-full"
            value={description}
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button

          type="submit"
          className="mt-5 w-full p-5 bg-orange-700 text-white text-lg rounded-xl animate-pulse"
        >

          Mint now!
        </button>
        <button
          onClick={logout}

          className="mt-5 w-full p-5 bg-red-700 text-white text-lg rounded-xl">

          Logout
        </button>
      </form>
    </div>
  );
}

export default Dashboard;