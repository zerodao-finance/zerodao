import * as hre from "hardhat";
import { expect } from "chai";
import { ethers as _ethers } from "ethers";
import { HardhatEthersHelpers } from "hardhat-deploy-ethers/types";
import { ZeroHeroNFT } from "../typechain-types";
import { SignerWithAddress } from "hardhat-deploy-ethers/signers";

//@ts-ignore
const ethers: typeof _ethers & HardhatEthersHelpers = hre.ethers;

describe("ZeroHeroNFT - Dev mint", function () {
  let contract: ZeroHeroNFT;
  let owner: SignerWithAddress, buyer1: SignerWithAddress;

  beforeEach(async () => {
    contract = (await ethers.getContract("ZeroHeroNFT")) as ZeroHeroNFT;
    [owner, buyer1] = await ethers.getSigners()
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

    await expect(tx).to.be.revertedWith('ExceedSupply');
  });
});

describe("ZeroHeroNFT - Minting before start", function () {
  let contract: ZeroHeroNFT;
  
  beforeEach(async () => {
    contract = (await ethers.getContract("ZeroHeroNFT")) as ZeroHeroNFT;
  });

  it("Public mint - Should not be able to mint before sale has started", async function () {
    const tx =  contract.mint(1,
        {value: ethers.utils.parseEther("999")});

    await expect(tx).to.be.revertedWith('PublicMintNotStarted');
  });

  it("Presale mint - Should not be able to mint before presale has started", async function () {
    const tx =  contract.privateMint([], 1,
       {value: ethers.utils.parseEther("999")});

    await expect(tx).to.be.revertedWith('PrivateMintNotStarted');
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
    await contract.connect(buyer1).mint(10,
      {value: ethers.utils.parseEther("999")});

    expect(await contract.balanceOf(buyer1.address)).to.equal(10);
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

    //Mint the first 980 
    for (let index = 0; index < 49; index++) {
      await contract.mint(20,
        {value: ethers.utils.parseEther("1")});  
    }

    //Try to mint 100 more
    //(total minted = 1050)
    const tx = contract.connect(buyer1).mint(100,
      {value: ethers.utils.parseEther("999")});

    await expect(tx).to.be.revertedWith('ExceedSupply');
  });
});

describe("ZeroHeroNFT - Withdraw", function () {
  let contract: ZeroHeroNFT;
  let owner: SignerWithAddress, buyer1: SignerWithAddress;

  beforeEach(async () => {
    contract = (await ethers.getContract("ZeroHeroNFT")) as ZeroHeroNFT;
    await contract.startPublicMint();

    [owner, buyer1] = await ethers.getSigners()
  });

  it("Should be only callable by the owner", async function () {
    const tx =  contract.connect(buyer1).withdraw();

    await expect(tx).to.be.reverted;
  });

  it("Should transfer the contract balance to owner wallet", async function () {
    var weiSpent = ethers.utils.parseEther("10");
    var oldOwnerBalance = toRoundedEther(await owner.getBalance());

    await contract.connect(buyer1).mint(1, {value: weiSpent})
    await contract.connect(owner).withdraw();

    var newOwnerBalance = toRoundedEther(await owner.getBalance());

    expect(newOwnerBalance).to.equal(oldOwnerBalance + toRoundedEther(weiSpent));
  });

  function toRoundedEther(wei) {
    return Math.round(Number.parseFloat(ethers.utils.formatEther(wei)));
  }
});