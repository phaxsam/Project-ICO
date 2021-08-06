// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
import "../@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../@openzeppelin/contracts/utils/math/SafeMath.sol";
contract ERC20Token is IERC20 {
    using SafeMath for uint256;
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 _totalsupply;
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowed;
    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _initialSupply
    ) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        _totalsupply = _initialSupply;
        balances[msg.sender] = _initialSupply;
    }
    
    function balanceOf(address owner) external override view returns(uint256) {
        return balances[owner];
    }
    function transfer(address to, uint256 amount) external override returns(bool) {
        require(balances[msg.sender] >= amount, "insufficient funds");
        balances[msg.sender].sub(amount);
        balances[to].add(amount);
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    function allowance(address owner, address spender) external view override returns (uint256) {
        return allowed[owner][spender];
    }
    function approve(address spender, uint256 amount) public override returns (bool) {
        allowed[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        uint256 _allowance = allowed[from][msg.sender];
        require(_allowance >= amount, "value too low");
        require(balances[from] >= amount, "balance too low");
        allowed[from][msg.sender].sub(amount);
        balances[from].sub(amount);
        balances[to].add(amount);
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    function totalSupply() external view override returns (uint256) {
        return _totalsupply;
    }
}