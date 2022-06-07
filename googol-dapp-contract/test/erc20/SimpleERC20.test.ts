import { expect } from "../shared/expect";
import { artifacts, ethers } from "hardhat";
import { Wallet } from "ethers";
import { BN, ether, expectRevert } from "@openzeppelin/test-helpers";
import { SimpleERC20 } from "../../typechain/SimpleERC20";
import { ServiceReceiver } from "../../typechain/ServiceReceiver";
import { shouldBehaveLikeERC20 } from "./behaviours/ERC20.behaviour";

let receiver: ServiceReceiver
const _name = 'SimpleERC20'
const _symbol = 'ERC20'
// const _decimals = new BN(18)
// const _initialSupply = new BN(100000000)
const _decimals = 18
const _initialSupply = 100000000

const fee = 0
const gasLimit = 4100000

// const SimpleERC20 = artifacts.readArtifact("SimpleERC20");
// const SimpleERC20 = ethers.getContractFactory("SimpleERC20");
// const ServiceReceiver = ethers.getContractFactory("ServiceReceiver");

context("SimpleERC20", () => {
  let owner: Wallet, other: Wallet, thirdParty: Wallet;
  
  // const [ owner, other, thirdParty ] = accounts;
  const fixture = async () => {
    const factoryFactory = await ethers.getContractFactory('SimpleERC20')
    return factoryFactory.connect(thirdParty).deploy(_name, _symbol, 0, receiver.address, {value: fee, gasLimit: gasLimit});
  }

  before("初始化账户", async () => {
    // [owner, other, thirdParty] = await (ethers as any).getSigners();
    // this.ctx.accounts = await (ethers as any).getSigners();
  });
  
  beforeEach(async function () {
    [owner, other, thirdParty] = await (ethers as any).getSigners();
    // this.ctx.accounts = await (ethers as any).getSigners();
    const serviceReceiver = await ethers.getContractFactory('ServiceReceiver')
    receiver =  await serviceReceiver.connect(owner).deploy()
    await receiver.deployed();
    // console.log(">>", receiver.address);
    // factory = await loadFixture(fixture)
  })
  describe("创建有效Token", () => {
    describe("无初始供应", () => {
      it("应该失败", async () => {
        // expect(await fixture()).to.be.reverted
      });
    });

    describe("有初始供应", () => {
      let token: SimpleERC20;
      before(async () => {
        const factoryFactory = await ethers.getContractFactory('SimpleERC20')
        token = (await factoryFactory.connect(owner).deploy(_name, _symbol, _initialSupply, receiver.address, {value: fee, gasLimit: gasLimit})) as SimpleERC20;
      });

      describe("一旦部署", () => {
        it("总供应量应等于初始供应量", async () => {
          expect(await token.totalSupply()).be.equal(_initialSupply)
        });
        it("所有者余额等于初始供应量", async () => {
          expect(await token.balanceOf(owner.address)).be.equal(_initialSupply)
        });
      });
    });
  });

  describe('SimpleERC20 token behaviours', function () {
    // let token: SimpleERC20;
    beforeEach(async () => {
      [owner, other, thirdParty] = await (ethers as any).getSigners();
      const factoryFactory = await ethers.getContractFactory('SimpleERC20')
      this.ctx.token = (await factoryFactory.connect(owner).deploy(_name, _symbol, _initialSupply, receiver.address, {value: fee, gasLimit: gasLimit})) as SimpleERC20;
    });
    // console.log(">>2", this.ctx.accounts[0]);
    context('like a ERC20', function () {
      // [owner, other, thirdParty] = ethers.getSigners();
      // let owner: Wallet, other: Wallet, thirdParty: Wallet;
      beforeEach(async () => {
        [owner, other, thirdParty] = await (ethers as any).getSigners();
      });
      console.log(">>2", owner, other);
      
      shouldBehaveLikeERC20(_name, _symbol, _decimals, _initialSupply, [owner, other, thirdParty])
    })
  });
});
// describe("SimpleERC20", function () {
//   it("创建有效Token", async function () {
//     const Greeter = await ethers.getContractFactory("Greeter");
//     const greeter = await Greeter.deploy("Hello, world!");
//     await greeter.deployed();

//     expect(await greeter.greet()).to.equal("Hello, world!");

//     const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

//     // wait until the transaction is mined
//     await setGreetingTx.wait();

//     expect(await greeter.greet()).to.equal("Hola, mundo!");
//   });
// });
