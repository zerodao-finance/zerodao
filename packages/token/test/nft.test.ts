import * as hre from "hardhat";
import { expect } from "chai";
import { ethers as _ethers } from "ethers";
import { HardhatEthersHelpers } from "hardhat-deploy-ethers/types";
import { ZeroHeroNFT } from "../typechain-types";
import { SignerWithAddress } from "hardhat-deploy-ethers/signers";
import { ZHERO_META_CID } from "../deploy/2_deploy_zero_hero";

//@ts-ignore
const ethers: typeof _ethers & HardhatEthersHelpers = hre.ethers;

// Vars
const NFT_COST = 0.3;
const PRIVATELIST_CLAIMS = require("../merkle/localhost/zhero-privatelist.json").claims;
const WHITELIST_CLAIMS = require("../merkle/localhost/zhero-whitelist.json").claims;


describe("ZeroHeroNFT - Dev mint", function () {
  let contract: ZeroHeroNFT;
  let owner: SignerWithAddress, buyer1: SignerWithAddress;

  beforeEach(async () => {
    const nftcontract = await hre.deployments.get("ZeroHeroNFT");
    [owner, buyer1] = await ethers.getSigners();
    contract = new ethers.Contract(
      nftcontract.address,
      nftcontract.abi,
      owner
    ) as ZeroHeroNFT;
  });

  it("Should mint the correct amount of nfts for the owner", async function () {
    await contract.devMint(2);
    expect(await contract.balanceOf(owner.address)).to.equal(2);
  });

  it("Should be only callable by the owner", async function () {
    const tx = contract.connect(buyer1).devMint(2);
    await expect(tx).to.be.reverted;
  });

  it("Should not be able to mint more than the reserved supply", async function () {
    const tx = contract.devMint(150);
    await expect(tx).to.be.revertedWith("ExceedSupply");
  });
});

describe("ZeroHeroNFT - Minting before start", function () {
  let contract: ZeroHeroNFT;
  let buyer1: SignerWithAddress;

  beforeEach(async () => {
    const nftcontract = await hre.deployments.get("ZeroHeroNFT");
    let [signer, _buyer1, _buyer2] = await ethers.getSigners();
    buyer1 = _buyer1;
    contract = new ethers.Contract(
      nftcontract.address,
      nftcontract.abi,
      signer
    ) as ZeroHeroNFT;
  });

  if(!process.env.PRIVATE_MINT) {
    it("Private mint - Should not be able to mint before private mint has started", async function () {
      const tx = contract
      .connect(buyer1)
      .privateMint(
        PRIVATELIST_CLAIMS[buyer1.address].index,
        ethers.utils.getAddress(buyer1.address),
        ethers.BigNumber.from("1"),
        PRIVATELIST_CLAIMS[buyer1.address].proof,
        3,
        { value: ethers.utils.parseEther('999') }
      );
      await expect(tx).to.be.revertedWith('PrivateMintNotStarted');
      expect(await contract.isPrivateActive()).to.equal(false)
    });
  }

  if(!process.env.WHITELIST_MINT) {
    it("Whitelist mint - Should not be able to mint before whitelist has started", async function () {
      const tx = contract
      .connect(buyer1)
      .whitelistMint(
        WHITELIST_CLAIMS[buyer1.address].index,
        ethers.utils.getAddress(buyer1.address),
        ethers.BigNumber.from("1"),
        WHITELIST_CLAIMS[buyer1.address].proof,
        3,
        { value: ethers.utils.parseEther('999') }
      );
      await expect(tx).to.be.revertedWith('WhitelistMintNotStarted');
      expect(await contract.isWhitelistActive()).to.equal(false)
    });
  }

  it("Public mint - Should not be able to mint before sale has started", async function () {
    const tx = contract.connect(buyer1).mint(1, { value: ethers.utils.parseEther("999") });
    await expect(tx).to.be.revertedWith("PublicMintNotStarted");
  });
});

describe("ZeroHeroNFT - Private Mint", async function () {
  let contract: ZeroHeroNFT;
  let owner: SignerWithAddress,
    buyer1: SignerWithAddress,
    buyer2: SignerWithAddress;

  beforeEach(async () => {
    const nftcontract = await hre.deployments.get("ZeroHeroNFT");
    [owner, buyer1, buyer2] = await ethers.getSigners();
    contract = new ethers.Contract(
      nftcontract.address,
      nftcontract.abi,
      owner
    ) as ZeroHeroNFT;
  });

  it("Should not be able to mint if not on private list", async function () {
    const amount = 3;
    await contract.startPrivateMint();
    expect(await contract.isPrivateActive()).to.equal(true)
    const tx = contract
      .connect(buyer2)
      .privateMint(
        PRIVATELIST_CLAIMS[buyer1.address].index,
        buyer2.address,
        PRIVATELIST_CLAIMS[buyer1.address].amount,
        PRIVATELIST_CLAIMS[buyer1.address].proof,
        amount,
        { value: ethers.utils.parseEther("999") }
      );

    await expect(tx).to.be.revertedWith("NotInPrivatelist");
  });

  it("Should not be able to mint if not sending enough ETH", async function () {
    const amount = 3;
    const tx = contract
      .connect(buyer1)
      .privateMint(
        PRIVATELIST_CLAIMS[buyer1.address].index,
        buyer1.address,
        PRIVATELIST_CLAIMS[buyer1.address].amount,
        PRIVATELIST_CLAIMS[buyer1.address].proof,
        amount,
        { value: ethers.utils.parseEther((NFT_COST).toString()) }
      );

    await expect(tx).to.be.revertedWith("InsufficientPayment");
  });

  it("Should mint the correct amount of nfts", async function () {
    const amount = 1;
    const previousAmount = ethers.utils.formatUnits(await contract.balanceOf(buyer1.address), 0);
    await contract
      .connect(buyer1)
      .privateMint(
        PRIVATELIST_CLAIMS[buyer1.address].index,
        buyer1.address,
        PRIVATELIST_CLAIMS[buyer1.address].amount,
        PRIVATELIST_CLAIMS[buyer1.address].proof,
        amount,
        { value: ethers.utils.parseEther("999") }
      );

    expect(await contract.balanceOf(buyer1.address)).to.equal(previousAmount + amount);
  });

  it("Should not allow for minting more than 10 NFT's per address", async function () {
    const amount = 11;
    const tx = contract
      .connect(buyer1)
      .privateMint(
        PRIVATELIST_CLAIMS[buyer1.address].index,
        buyer1.address,
        PRIVATELIST_CLAIMS[buyer1.address].amount,
        PRIVATELIST_CLAIMS[buyer1.address].proof,
        amount,
        { value: ethers.utils.parseEther("999") }
      );
    await expect(tx).to.be.revertedWith("ExceedMaxPerWallet");
  });
});

describe("ZeroHeroNFT - Whitelist Mint", async function () {
  let contract: ZeroHeroNFT;
  let owner: SignerWithAddress,
    buyer1: SignerWithAddress,
    buyer2: SignerWithAddress;

  beforeEach(async () => {
    const nftcontract = await hre.deployments.get("ZeroHeroNFT");
    [owner, buyer1, buyer2] = await ethers.getSigners();
    contract = new ethers.Contract(
      nftcontract.address,
      nftcontract.abi,
      owner
    ) as ZeroHeroNFT;
  });

  it("Should not be able to mint if not on white list", async function () {
    const amount = 3;
    await contract.startWhitelistMint();
    expect(await contract.isWhitelistActive()).to.equal(true)
    const tx = contract
      .connect(buyer2)
      .whitelistMint(
        WHITELIST_CLAIMS[buyer1.address].index,
        buyer2.address,
        WHITELIST_CLAIMS[buyer1.address].amount,
        WHITELIST_CLAIMS[buyer1.address].proof,
        amount,
        { value: ethers.utils.parseEther("999") }
      );

    await expect(tx).to.be.revertedWith("NotInWhitelist");
  });

  it("Should not be able to mint if not sending enough ETH", async function () {
    const amount = 3;
    const tx = contract
      .connect(buyer1)
      .whitelistMint(
        WHITELIST_CLAIMS[buyer1.address].index,
        buyer1.address,
        WHITELIST_CLAIMS[buyer1.address].amount,
        WHITELIST_CLAIMS[buyer1.address].proof,
        amount,
        { value: ethers.utils.parseEther((NFT_COST).toString()) }
      );

    await expect(tx).to.be.revertedWith("InsufficientPayment");
  });

  it("Should mint the correct amount of nfts", async function () {
    const amount = 1;
    const previousAmount = Number(ethers.utils.formatUnits(await contract.balanceOf(buyer1.address), 0));
    await contract
      .connect(buyer1)
      .whitelistMint(
        WHITELIST_CLAIMS[buyer1.address].index,
        buyer1.address,
        WHITELIST_CLAIMS[buyer1.address].amount,
        WHITELIST_CLAIMS[buyer1.address].proof,
        amount,
        { value: ethers.utils.parseEther("999") }
      );

    expect(await contract.balanceOf(buyer1.address)).to.equal(previousAmount + amount);
  });

  it("Should not allow for minting more than 10 NFT's per address", async function () {
    const amount = 11;
    const tx = contract
      .connect(buyer1)
      .whitelistMint(
        WHITELIST_CLAIMS[buyer1.address].index,
        buyer1.address,
        WHITELIST_CLAIMS[buyer1.address].amount,
        WHITELIST_CLAIMS[buyer1.address].proof,
        amount,
        { value: ethers.utils.parseEther("999") }
      );
    await expect(tx).to.be.revertedWith("ExceedMaxPerWallet");
  });
});

describe("ZeroHeroNFT - Public mint", function () {
  let contract: ZeroHeroNFT;
  let owner: SignerWithAddress, buyer1: SignerWithAddress;

  beforeEach(async () => {
    contract = (await ethers.getContract("ZeroHeroNFT")) as ZeroHeroNFT;
    await contract.startPublicMint();
    [owner, buyer1] = await ethers.getSigners()
  });

  it("Should mint the correct amount of nfts", async function () {
    const amount = 10;
    const previousAmount = Number(ethers.utils.formatUnits(await contract.balanceOf(buyer1.address), 0));
    await contract.connect(buyer1).mint(amount,
      {value: ethers.utils.parseEther("999")});
    expect(await contract.balanceOf(buyer1.address)).to.equal(previousAmount + amount);
  });

  it("Should not be able to mint if payment is insufficient", async function () {
    await contract.setMintPrice(ethers.utils.parseEther("2"));

    const tx = contract.connect(buyer1).mint(1,
      {value: ethers.utils.parseEther("1")});

    await expect(tx).to.be.revertedWith('InsufficientPayment');
  });

  it("Should not be able to mint more than the whole collection", async function () {
    //Setting price to very low value so our account can mint a lot
    await contract.setMintPrice(ethers.utils.parseEther("0.001"));

    //Mint the first 2980
    for (let index = 0; index < 149; index++) {
      const amount = 20;
      await contract.mint(amount,
        {value: ethers.utils.parseEther("1")});
    }

    //Try to mint 100 more
    //(total minted = 3080)
    const tx = contract.connect(buyer1).mint(100,
      {value: ethers.utils.parseEther("999")});

    await expect(tx).to.be.revertedWith('ExceedSupply');
  });
});

describe("ZeroHeroNFT - Etc", async function () {
  let contract: ZeroHeroNFT;
  let owner: SignerWithAddress, buyer1: SignerWithAddress;

  beforeEach(async () => {
    const nftcontract = await hre.deployments.get("ZeroHeroNFT");
    [owner, buyer1] = await ethers.getSigners();
    contract = new ethers.Contract(
      nftcontract.address,
      nftcontract.abi,
      owner
    ) as ZeroHeroNFT;
    // Set Token URI
    await contract.connect(owner).setBaseTokenURI(`ipfs://${ZHERO_META_CID}/`);
  });

  it("Should retrieve the correct Token URI", async function () {
    expect(await contract.tokenURI(0)).to.equal(`ipfs://${ZHERO_META_CID}/0.json`)
  });

  it("Should allow private/white listers to mint even though public mint has started", async function () {
    const amount = 1;
    const tx = contract
    .connect(buyer1)
    .privateMint(
      PRIVATELIST_CLAIMS[buyer1.address].index,
      buyer1.address,
      PRIVATELIST_CLAIMS[buyer1.address].amount,
      PRIVATELIST_CLAIMS[buyer1.address].proof,
      amount,
      { value: ethers.utils.parseEther("999") }
    );
    const tx2 = contract
    .connect(buyer1)
    .whitelistMint(
      WHITELIST_CLAIMS[buyer1.address].index,
      buyer1.address,
      WHITELIST_CLAIMS[buyer1.address].amount,
      WHITELIST_CLAIMS[buyer1.address].proof,
      amount,
      { value: ethers.utils.parseEther("999") }
    );
    await expect(tx).to.be.revertedWith("ExceedMaxPerWallet");
    await expect(tx2).to.be.revertedWith("ExceedMaxPerWallet");
  })
});

describe("ZeroHeroNFT - Withdraw", function () {
  let contract: ZeroHeroNFT;
  let owner: SignerWithAddress, buyer1: SignerWithAddress;

  beforeEach(async () => {
    const nftcontract = await hre.deployments.get("ZeroHeroNFT");
    [owner, buyer1] = await ethers.getSigners();
    contract = new ethers.Contract(
      nftcontract.address,
      nftcontract.abi,
      owner
    ) as ZeroHeroNFT;
  });

  it("Should be only callable by the owner", async function () {
    const tx = contract.connect(buyer1).withdraw();

    await expect(tx).to.be.reverted;
  });
});
