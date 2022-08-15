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
  const fileUrl = selected_img;

  const onSubmit = async (e) => {

    setIsLoading(true);
    e.preventDefault();

    try {






      // These will be retrieved from a list of mintable NFTs, coming from a server/table

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



          <nav class="bg-gray-800 py-1 rounded-md navbar2">
            <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
              <div class="relative flex items-center justify-between h-16">
                <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  <button type="button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                    <span class="sr-only">Open main menu</span>

                    <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>

                    <svg class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                  <div class="flex-shrink-0 flex items-center">
                    <img class="block lg:hidden h-8 w-auto" src="/images/logo.png" alt="Workflow" img />
                    <img class="hidden lg:block h-8 w-auto" src="/images/logo.png" alt="Workflow" img />
                  </div>
                  <div class="hidden sm:block sm:ml-6">
                    <div class="flex space-x-4">

                      <a href="#" class="text-gray-300 text-white px-3 py-2 rounded-md text-sm font-medium" aria-current="page">Dashboard</a>

                      <a href="#" class="bg-gray-900 text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Minting</a>

                      <a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Team</a>

                      <a href={logout} class="bg-red-600 text-white-300 hover:bg-red-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Logout</a>
                    </div>
                  </div>
                </div>
                <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <button type="button" class="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <span class="sr-only">View notifications</span>

                    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </button>


                  <div class="ml-3 relative">
                    <div>
                      <button type="button" class="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                        <span class="sr-only">Open user menu</span>
                        <img class="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" img />
                      </button>
                    </div>

                    <div class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">

                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div class="sm:hidden" id="mobile-menu">
              <div class="px-2 pt-2 pb-3 space-y-1">

                <a href="#" class="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium" aria-current="page">Dashboard</a>

                <a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Team</a>

                <a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Projects</a>

                <a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Calendar</a>
              </div>
            </div>
          </nav>


          <img src={selected_img} className='w-50 h-60 prevImg'></img>
          <button className="flex justify-left">





          </button>
          <h2 className="address">{contractAddress}</h2>
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

          className="w-30 p-5 bg-red-700 text-white text-lg rounded-xl log">

          Logout
        </button>
      </form>
      <img src="https://imgs.search.brave.com/W63rDUMxUMiWOiqveGKz7_aYwNjisc9JL8MNbXRy7tc/rs:fit:980:980:1/g:ce/aHR0cDovL2Nkbi5v/bmxpbmV3ZWJmb250/cy5jb20vc3ZnL2lt/Z18yMTUwNTkucG5n" className="w-10 h-45 acc"></img>
    </div>
  );
}

export default Dashboard;