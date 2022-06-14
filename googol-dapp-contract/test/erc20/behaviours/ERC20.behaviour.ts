import { expect } from "chai";
import { BigNumber, constants } from "ethers";
import { ethers } from "hardhat";

const { AddressZero } = constants;

export function shouldBehaveLikeERC20(
  name: String,
  symbol: String,
  decimals: Number,
  initialBalance: BigNumber,
  ...accounts: string[]
) {
  const [owner, other, thirdParty] = accounts;

  it("有代币名称", async function () {
    expect(await this.token.name()).be.equal(name);
  });

  it("有代币符号", async function () {
    expect(await this.token.symbol()).be.equal(symbol);
  });

  it("有代币精度", async function () {
    expect(await this.token.decimals()).to.be.equal(decimals);
  });

  describe("代币总量", function () {
    it("代币总量等于初始供应量", async function () {
      expect(await this.token.totalSupply()).to.be.equal(initialBalance);
    });
  });

  describe("余额", function () {
    describe("当请求的账户没有代币时", function () {
      it("应该返回0", async function () {
        expect(await this.token.balanceOf(other)).be.equal(0);
      });
    });
    describe("当请求的账户有代币时", function () {
      it("返回的余额等于该账户持有的代币数量", async function () {
        expect(await this.token.balanceOf(owner)).be.equal(initialBalance);
      });
    });
  });

  describe("转账 transfer", function () {
    shouldBehaveLikeERC20Transfer(initialBalance, owner, thirdParty);
  });

  describe("批准 approve", function () {
    shouldBehaveLikeERC20Approve(initialBalance, owner, thirdParty);
  });

  describe("从指定账户转账 transfer from", function () {
    describe("当收件人不是零地址时", function () {
      describe("当消费者没有足够的批准余额时", function () {
        beforeEach(async function () {
          const spender = thirdParty;
          await this.token.approve(spender, initialBalance, { from: owner });
        });
        describe("当所有者有足够的余额时", function () {
          const amount = initialBalance;
          it("转移请求的金额", async function () {
            const spender = thirdParty;
            const to = other;
            const f = await ethers.getSigner(spender);
            await this.token.connect(f).transferFrom(owner, to, amount, { from: spender });
            const ownerBalance = await this.token.balanceOf(owner);
            const toBalance = await this.token.balanceOf(to);

            expect(ownerBalance.toString()).to.be.equal("0");
            expect(toBalance.toString()).to.be.equal(amount.toString());
          });

          it("减少消费津贴", async function () {
            const spender = thirdParty;
            const to = other;
            const f = await ethers.getSigner(spender);
            await this.token.connect(f).transferFrom(owner, to, amount, { from: spender });
            const allowance = await this.token.allowance(owner, spender);

            expect(allowance.toString()).to.be.equal("0");
          });

          it("发出Transfer事件", async function () {
            const spender = thirdParty;
            const to = other;
            const f = await ethers.getSigner(spender);
            await expect(this.token.connect(f).transferFrom(owner, to, amount, { from: spender }))
              .emit(this.token, "Transfer")
              .withArgs(owner, to, amount);
          });
        });
        describe("当所有者没有足够的余额时", function () {
          const amount = initialBalance.add(1);

          it("应该失败", async function () {
            const spender = thirdParty;
            const to = other;
            const f = await ethers.getSigner(spender);
            await expect(this.token.connect(f).transferFrom(owner, to, amount, { from: spender }))
              .revertedWith("ERC20: insufficient allowance");
          });
        });
      });
      describe("当支出者没有足够的余额时", function () {
        beforeEach(async function () {
          const spender = thirdParty;
          await this.token.approve(spender, 99, { from: owner });
        });
        describe("当所有者有足够的余额时", function () {
          const amount = initialBalance;

          it("应该失败", async function () {
            const spender = thirdParty;
            const to = other;
            const f = await ethers.getSigner(spender);
            await expect(this.token.connect(f).transferFrom(owner, to, amount, { from: spender }))
              .revertedWith("ERC20: insufficient allowance");
          });
        });
        describe("当所有者没有足够的余额时", function () {
          const amount = initialBalance.add(1);

          it("应该失败", async function () {
            const spender = thirdParty;
            const to = other;
            const f = await ethers.getSigner(spender);
            await expect(this.token.connect(f).transferFrom(owner, to, amount, { from: spender }))
              .revertedWith("ERC20: insufficient allowance");
          });
        });
      });
    });
    describe("当收件人是零地址时", function () {
      const amount = initialBalance;
      const to = AddressZero;

      beforeEach(async function () {
        const spender = thirdParty;
        await this.token.approve(spender, amount, { from: owner });
      });

      it("应该失败", async function () {
        const spender = thirdParty;
        const f = await ethers.getSigner(spender);
        await expect(this.token.connect(f).transferFrom(owner, to, amount, { from: spender }))
          .revertedWith("ERC20: transfer to the zero address");
      });
    });
  });

  describe("减少津贴", function () {
    describe("当支出者不是零地址时", function () {
      function shouldDecreaseApproval(amount: any) {
        describe("当之前没有批准的金额时", function () {
          it("应该失败", async function () {
            const spender = thirdParty;
            await expect(this.token.decreaseAllowance(spender, amount, { from: owner }))
              .revertedWith("ERC20: decreased allowance below zero");
          });
        });
        describe("当消费者有一个批准的金额时", function () {
          const approvedAmount = amount;
          beforeEach(async function () {
            const spender = thirdParty;
            ({ logs: this.logs } = await this.token.approve(spender, approvedAmount, {
              from: owner,
            }));
          });
          it("发出Approval事件", async function () {
            const spender = thirdParty;
            await expect(this.token.decreaseAllowance(spender, approvedAmount, { from: owner }))
              .emit(this.token, "Approval")
              .withArgs(owner, spender, 0);
          });
          it("减少消费津贴减去要求的金额", async function () {
            const spender = thirdParty;
            await this.token.decreaseAllowance(spender, approvedAmount.sub(1), { from: owner });
            const allowance = await this.token.allowance(owner, spender);

            expect(allowance.toString()).to.be.equal("1");
          });
          it("删除所有余量时将余量设置为零", async function () {
            const spender = thirdParty;
            await this.token.decreaseAllowance(spender, approvedAmount, { from: owner });
            const allowance = await this.token.allowance(owner, spender);

            expect(allowance.toString()).to.be.equal("0");
          });
          it("删除超过全部限额时应该失败", async function () {
            const spender = thirdParty;
            await expect(
              this.token.decreaseAllowance(spender, approvedAmount.add(1), { from: owner })
            )
              .revertedWith("ERC20: decreased allowance below zero");
          });
        });
      }

      describe("当发件人有足够的余额时", function () {
        const amount = initialBalance;

        shouldDecreaseApproval(amount);
      });

      describe("当发件人没有足够的余额时", function () {
        const amount = initialBalance.add(1);

        shouldDecreaseApproval(amount);
      });
    });

    describe("当支出者是零地址时", function () {
      const amount = initialBalance;
      const spender = AddressZero;

      it("应该失败", async function () {
        await expect(this.token.decreaseAllowance(spender, amount, { from: owner }))
          .revertedWith("ERC20: decreased allowance below zero");
      });
    });
  });

  describe("增加津贴", function () {
    describe("当支出者不是零地址时", function () {
      describe("当发件人有足够的余额时", function () {
        it("发出 Approval 事件", async function () {
          const amount = initialBalance;
          const spender = thirdParty;
          await expect(this.token.increaseAllowance(spender, amount, { from: owner }))
            .emit(this.token, "Approval")
            .withArgs(owner, spender, amount);
        });

        describe("当之前没有批准的金额时", function () {
          it("批准请求的金额", async function () {
            const amount = initialBalance;
            const spender = thirdParty;
            await this.token.increaseAllowance(spender, amount, { from: owner });
            const allowance = await this.token.allowance(owner, spender);

            expect(allowance.toString()).to.be.equal(amount.toString());
          });
        });

        describe("当消费者有一个批准的金额时", function () {
          beforeEach(async function () {
            const spender = thirdParty;
            await this.token.approve(spender, 1, { from: owner });
          });

          it("增加消费津贴加上要求的金额", async function () {
            const amount = initialBalance;
            const spender = thirdParty;
            await this.token.increaseAllowance(spender, amount, { from: owner });
            const allowance = await this.token.allowance(owner, spender);
            const newAmount = amount.add(1);

            expect(allowance.toString()).to.be.equal(newAmount.toString());
          });
        });
      });
      describe("当发件人没有足够的余额时", function () {
        it("发出 Approval 事件", async function () {
          const amount = initialBalance.add(1);
          const spender = thirdParty;
          await expect(this.token.increaseAllowance(spender, amount, { from: owner }))
            .emit(this.token, "Approval")
            .withArgs(owner, spender, amount);
        });

        describe("当之前没有批准的金额时", function () {
          it("批准请求的金额", async function () {
            const amount = initialBalance.add(1);
            const spender = thirdParty;
            await this.token.increaseAllowance(spender, amount, { from: owner });
            const allowance = await this.token.allowance(owner, spender);

            expect(allowance.toString()).to.be.equal(amount.toString());
          });
        });

        describe("当消费者有一个批准的金额时", function () {
          beforeEach(async function () {
            const spender = thirdParty;
            await this.token.approve(spender, 1, { from: owner });
          });

          it("增加消费津贴加上要求的金额", async function () {
            const amount = initialBalance.add(1);
            const spender = thirdParty;
            await this.token.increaseAllowance(spender, amount, { from: owner });
            const allowance = await this.token.allowance(owner, spender);
            const newAmount = amount.add(1);

            expect(allowance.toString()).to.be.equal(newAmount.toString());
          });
        });
      });
    });

    describe("当支出者是零地址时", function () {
      it("应该失败", async function () {
        const amount = initialBalance;
        const spender = AddressZero;
        await expect(this.token.increaseAllowance(spender, amount, { from: owner })).revertedWith(
          "ERC20: approve to the zero address"
        );
      });
    });
  });
}

export function shouldBehaveLikeERC20Transfer(initialBalance: BigNumber, from: string, to: string){
  describe("当收款账户不是零地址时", function () {
    describe("转账人没有足够余额时", function () {
      const amount = initialBalance.add(1);
      it("应该失败", async function () {
        expect(this.token.transfer(to, amount, { from }))
          .revertedWith("ERC20: transfer amount exceeds balance");
      });
    });
    describe("转账人有足够余额时", function () {
      const amount = initialBalance;
      it("转账成功", async function () {
        await this.token.transfer(to, amount, { from });
        const ownerBalance = await this.token.balanceOf(from);
        const toBalance = await this.token.balanceOf(to);
        expect(ownerBalance.toString()).to.be.equal("0");
        expect(toBalance.toString()).to.be.equal(amount.toString());
      });
      it("并且发出了Transfer事件", async function () {
        await expect(this.token.transfer(to, amount))
          .to.emit(this.token, "Transfer")
          .withArgs(from, to, amount);
      });
    });
  });
  describe("当收款账户是零地址时", function () {
    it("转账应该失败", async function () {
      const to = AddressZero;
      await expect(this.token.transfer(to, initialBalance, { from }))
        .to.emit(this.token, "Transfer")
        .revertedWith("ERC20: transfer to the zero address");
    });
  });
}

export function shouldBehaveLikeERC20Approve(supply: BigNumber, owner: string, spender: string){
  describe("当支出账户不是零地址时", function () {
    describe("当发件人有足够的余额时", function () {
      const amount = supply;
      it("发出批准事件", async function () {
        await expect(this.token.approve(spender, amount, { from: owner }))
          .to.emit(this.token, "Approval")
          .withArgs(owner, spender, amount);
      });

      describe("当之前没有批准的金额时", function () {
        it("批准请求的金额", async function () {
          await this.token.approve(spender, amount, { from: owner });
          const allowance = await this.token.allowance(owner, spender);
          expect(allowance.toString()).to.be.equal(amount.toString());
        });
      });

      describe("当消费者有一个批准的金额时", function () {
        beforeEach(async function () {
          await this.token.approve(spender, 1, { from: owner });
        });
        it("批准请求的金额并替换之前的金额", async function () {
          await this.token.approve(spender, amount, { from: owner });
          const allowance = await this.token.allowance(owner, spender);
          expect(allowance.toString()).to.be.equal(amount.toString());
        });
      });
    });
    describe("当发件人没有足够的余额时", function () {
      const amount = supply.add(1);
      it("发出批准事件", async function () {
        expect(this.token.approve(spender, amount, { from: owner }))
          .to.emit(this.token, "Approval")
          .withArgs(owner, spender, amount);
      });

      describe("当之前没有批准的金额时", function () {
        it("批准请求的金额", async function () {
          await this.token.approve(spender, amount, { from: owner });
          const allowance = await this.token.allowance(owner, spender);
          expect(allowance.toString()).to.be.equal(amount.toString());
        });
      });

      describe("当消费者有一个批准的金额时", function () {
        beforeEach(async function () {
          await this.token.approve(spender, 1, { from: owner });
        });
        it("批准请求的金额并替换之前的金额", async function () {
          await this.token.approve(spender, amount, { from: owner });
          const allowance = await this.token.allowance(owner, spender);
          expect(allowance.toString()).to.be.equal(amount.toString());
        });
      });
    });
  });

  describe("当支出者是零地址时", function () {
    const amount = supply;
    const spender = AddressZero;
    it("应该失败", async function () {
      await expect(this.token.approve(spender, amount, { from: owner }))
        .revertedWith("ERC20: approve to the zero address");
    });
  });
}