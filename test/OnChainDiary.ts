import { expect } from "chai";
import { ethers } from "hardhat";

describe("OnChainDiary", function () {
  it("writes once per day and retrieves", async function () {
    const [user] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("OnChainDiary");
    const diary = await Factory.deploy();
    await diary.waitForDeployment();

    const today = Math.floor((await ethers.provider.getBlock("latest")).timestamp / 86400);

    await expect(diary.connect(user).writeDiary("hello world"))
      .to.emit(diary, "DiaryWritten")
      .withArgs(user.address, today, "hello world");

    const stored = await diary.getDiary(user.address, today);
    expect(stored).to.eq("hello world");

    await expect(diary.writeDiary("second"))
      .to.be.revertedWith("Already written today");

    // advance one day
    await ethers.provider.send("evm_increaseTime", [86400]);
    await ethers.provider.send("evm_mine", []);

    await expect(diary.writeDiary("new day"))
      .to.emit(diary, "DiaryWritten");
  });

  it("rejects long content", async function () {
    const Factory = await ethers.getContractFactory("OnChainDiary");
    const diary = await Factory.deploy();
    await diary.waitForDeployment();

    const long = "x".repeat(281);
    await expect(diary.writeDiary(long)).to.be.revertedWith("Content too long");
  });
});



