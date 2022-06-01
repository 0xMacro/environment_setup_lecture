import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Fixture } from "ethereum-waffle";
import { loadFixture } from "ethereum-waffle";
import hre, { ethers } from "hardhat";
const BigNumber = ethers.BigNumber;
import { Guestbook } from "../typechain"

const provider = ethers.provider
let account1: SignerWithAddress
let account2: SignerWithAddress

interface TextContext {
  guestbook: Guestbook
}

describe("Guestbook", function () {
  it("should sign and get entries", async function () {
    [account1, account2] = await ethers.getSigners();

    const Guestbook = await ethers.getContractFactory("Guestbook");
    const guestbook: Guestbook = await Guestbook.deploy();
    await guestbook.deployed();

    expect(await guestbook.getEntries()).deep.equal([]);

    const tx = guestbook.sign("Hello", { value: 100 })

    await expect(tx)
      .to.emit(guestbook, 'NewEntry')
      .withArgs(account1.address, 0);

    await guestbook.sign("Hello", { value: 200 });

    expect(await guestbook.getEntries()).deep.equal([
      [account1.address, "Hello", BigNumber.from(100)],
      [account1.address, "Hello", BigNumber.from(200)]
    ]);
  });

  it("should advance time", async () => {
    let blockNumber = await provider.getBlockNumber()
    await increaseTime(60)
    blockNumber = await provider.getBlockNumber()
  })

  async function fixture(): Promise<TextContext> {
    [account1, account2] = await ethers.getSigners();

    const Guestbook = await ethers.getContractFactory("Guestbook");
    const guestbook: Guestbook = await Guestbook.deploy();
    await guestbook.deployed();

    return {
      guestbook
    }
  }
});

const increaseTime = async (seconds: number): Promise<void> => {
  await hre.network.provider.send("evm_increaseTime", [seconds]);
  await hre.network.provider.send("evm_mine");
}