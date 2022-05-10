const MORTToken = artifacts.require("./contracts/MORTToken.sol");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');
const {expect} = require('chai');

contract('MORTToken', (accounts) => {
    //Variables
    const owner = accounts[0]; // OWNER adress => 0
    let MORTTokenInstance;     // Declare instance token

    context("Testing Token , SwapToken", function () {
        before(async function () {
            MORTTokenInstance = await MORTToken.new('10000000000000000000000000',{from:owner});
            await MORTTokenInstance.transfer(MORTTokenInstance.address, '10000000000000000000000000')
        });

        it("Test first", async () => {
            const sendETH = (0.021*10**18);
            const swapETHtoMORT = await MORTTokenInstance.swapETHtoMORT({from: accounts[1], value: new BN(sendETH.toString())});
            console.log('balance MoonRocketToken after swap ETH to MORT',(await MORTTokenInstance.balanceOf(accounts[1])).toString())
            expect(swapETHtoMORT).to.be.ok;
        });

        it("Test second swap invert", async () => {
            const balanceCtrEth = await MORTTokenInstance.getBalanceETH({from:owner});
            console.log('balanceCtrEth', balanceCtrEth.toString());
            const sendMORT = (0.001*10**18);
            console.log((await MORTTokenInstance.balanceOf(accounts[1])).toString())
            console.log(sendMORT)
            await MORTTokenInstance.approve(MORTTokenInstance.address,new BN(sendMORT.toString()), {from: accounts[1]})
            const swapMORTtoETH = await MORTTokenInstance.swapMORTtoETH(new BN(sendMORT.toString()),{from: accounts[1]});
            expect(swapMORTtoETH).to.be.ok;
        });
    });
});
