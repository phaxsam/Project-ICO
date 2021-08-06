const {expectRevert, time} = require("@openzeppelin/test-helpers");
const { default: context } = require("react-bootstrap/esm/AccordionContext");
const ICO = artifacts.require("ICO.sol");
const Token = artifacts.require("ERC20Token.sol");
contract("ICO", (accounts)=> {
    let ico;
    let token;
    const name = "Farm-Bit";
    const symbol = "FB";
    const decimals = 18;
    const initialBalance = web3.utils.toBN(web3.utils.toWei("1000"));
    beforeEach(async() => {
        ico = await ICO.new(name, symbol, decimals, initialBalance);
        const tokenAddress = await ico.token();
        token = await Token.at(tokenAddress);
    });
    it("should create an ERC20 token", async() => {
        const _name = "Farm-Bit";
        const _symbol = "FB";
        const _decimals = 18;
        const _initialBalance = web3.utils.toBN(web3.utils.toWei(1));
        const newICO = await ICO.new(_name, _symbol, _decimals, _initialBalance);
        const newTokenAddress = await newICO.token();
        const newToken = await Token.at(newTokenAddress);
        const totalSupply = await newToken.totalSupply();
        assert(_name === "Farm-Bit");
        assert(_symbol === "FB");
        assert(_decimals === 18);
        assert(totalSupply.eq(_initialBalance));
    });
    it("should start the ICO", async() => {
        const duration = 100;
        const price = 2;
        const availableTokens = web3.utils.toBN(web3.utils.toWei("50"));
        const minPurchase = web3.utils.toBN(web3.utils.toWei("1"));
        const maxPurchase = web3.utils.toBN(web3.utils.toWei("10"));
        await ico.start(duration, price, availableTokens, minPurchase, maxPurchase);
        const icoSupply = await ico.availableTokens();
        const minAmount = await ico.minPurchase();
        const maxAmount = await ico.maxPurchase();
        assert(duration === 100);
        assert(price === 2);
        assert(icoSupply.eq(availableTokens));
        assert(minAmount.eq(minPurchase));
        assert(maxAmount.eq(maxPurchase));
    });
    it("should NOT start ICO if avaialbleTokens are greater than totalSupply", async() => {
        const duration = 100;
        const price = 2;
        const availableTokens = web3.utils.toBN(web3.utils.toWei("5000"));
        const minPurchase = web3.utils.toBN(web3.utils.toWei("1"));
        const maxPurchase = web3.utils.toBN(web3.utils.toWei("1000"));
        await expectRevert(
            ico.start(duration, price, availableTokens, minPurchase, maxPurchase),
            "DURATION must be GREATER THAN 0"
        );
    });
    context("Sale started", () => {
        let start;
        const duration = 100;
        const price = 2;
        const avaialbleTokens = web3.utils.toWei("30");
        const minPurchase = web3.utils.toWei("1");
        const maxPurchase = web3.utils.toWei("10");
        beforeEach(async () => {
            start = parseInt(new Date().getTime() / 1000);
            time.increaseTo(start);
            ico.start(duration, price, avaialbleTokens, minPurchase, maxPurchase);
        });
        it("should only let investors buy", async() => {
            await ico.whitelist(accounts[1], {from: accounts[0]});
            await expectRevert(
                ico.buy({from: accounts[3], amount: 4}),
                "only investors"
            );
        });
        it("should only buy multiple of price", async() => {
            await ico.whitelist(accounts[1], {from: accounts[0]});
            await expectRevert(
                ico.buy({from: accounts[1], amount: 1}), 
                "must send multiple of price"
            );
        });
        it("should NOT buy btw min and max purchase", async() => {
            await ico.whitelist(accounts[1], {from: accounts[0]});
            await expectRevert(
                ico.buy({from: accounts[1], amount: 12}),
                "must send btw minPurchase and maxPurchase"
            );
        });
        it("should NOT buy if insufficient funds", async() => {
            await ico.whitelist(accounts[1], { from: accounts[0] });
            await ico.whitelist(accounts[2], { from: accounts[0] });
            await ico.whitelist(accounts[3], { from: accounts[0] });
            await ico.whitelist(accounts[4], { from: accounts[0] });
      
            await ico.buy({ from: accounts[1], value: 10 });
            await ico.buy({ from: accounts[2], value: 10 });
            await ico.buy({ from: accounts[3], value: 10 });
            await expectRevert(
              ico.buy({ from: accounts[4], value: 4 }),
              "not enough tokens left for sale"
        );
    });
    it("full ico process: investors buy, admin release and withdraw", async () => {
        await ico.whitelist(accounts[1], { from: accounts[0] });
        await ico.whitelist(accounts[2], { from: accounts[0] });
        await ico.whitelist(accounts[3], { from: accounts[0] });
  
        await ico.buy({ from: accounts[1], value: 10 });
        await ico.buy({ from: accounts[2], value: 10 });
        await ico.buy({ from: accounts[3], value: 10 });
  
        time.increase(time.duration.minutes(2));
  
        await ico.release({ from: accounts[0] });
        await ico.withdraw(accounts[1], 10, { from: accounts[0] });
        await ico.withdraw(accounts[2], 10, { from: accounts[0] });
        await ico.withdraw(accounts[3], 10, { from: accounts[0] });
      });
    });

});
