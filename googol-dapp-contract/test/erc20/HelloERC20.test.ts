import { ethers } from "hardhat";
import { ServiceReceiver } from "../../typechain/ServiceReceiver";
import { HelloERC20 } from "../../typechain/HelloERC20";
import { shouldBehaveLikeERC20 } from "./behaviours/ERC20.behaviour";

describe('HelloERC20', function () {
  const _name = "HelloERC20";
  const _symbol = "ERC20";
  const _decimals = 18;
  const _initialSupply = ethers.utils.parseEther('10000');
  const owner = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
  const other = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
  const thirdParty = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC';

  before('部署ServiceReceiver合约', async function () {
    const factory = await ethers.getContractFactory("ServiceReceiver");
    this.serviceReceiver = (await factory.deploy()) as ServiceReceiver;
  });
  describe("测试 HelloERC20 合约的标准方法", function () {
    beforeEach(async function () {
      const factory = await ethers.getContractFactory(_name)
      this.token = (await factory.deploy(_name, _symbol, this.serviceReceiver.address)) as HelloERC20;
    });
    shouldBehaveLikeERC20(_name, _symbol, _decimals, _initialSupply, owner, other, thirdParty)
  })
});