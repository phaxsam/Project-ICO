// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
import "./ERC20Token.sol";
import "../@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../@openzeppelin/contracts/utils/math/SafeMath.sol";

contract ICO is ReentrancyGuard {
    using SafeMath for uint256;
    struct Sale {
        address investor;
        uint256 volume;
    }
    Sale[] public sales;
    modifier activeICO() {
        require(
            end > 0 && block.timestamp < end && availableTokens > 0,
            "ICO MUST BE ACTIVE"
        );
        _;
    }
    modifier unactivatedICO() {
        require(end == 0, "ICO SHOULD NOT BE ACTIVE");
        _;
    }
    modifier endOfICO() {
        require(
            end > 0 && (block.timestamp >= end || availableTokens == 0),
            "ICO must END"
        );
        _;
    }
    modifier onlyAdmin() {
        require(msg.sender == admin, "ONLY ADMIN");
        _;
    }
    modifier onlyInvestors() {
        require(investors[msg.sender] == true, "INVESTORS ONLY");
        _;
    }
    modifier tokensNotReleased() {
        require(released == false, "TOKENS NOT RELEASED");
        _;
    }
    modifier tokensReleased() {
        require(released == true, "TOKENS MUST BE RELEASED");
        _;
    }
    address public token;
    address public admin;
    uint256 public end;
    uint256 public price;
    uint256 public availableTokens;
    uint256 public minPurchase;
    uint256 public maxPurchase;
    bool public released;
    mapping(address => bool) public investors;

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _totalsupply
    ) {
        token = address(
            new ERC20Token(_name, _symbol, _decimals, _totalsupply)
        );
        admin = msg.sender;
    }

    function getSale(address _investor) external view returns (uint256) {
        for (uint256 i = 0; i < sales.length; i++) {
            if (sales[i].investor == _investor) {
                return sales[i].volume;
            }
        }
        return 0;
    }

    function start(
        uint256 duration,
        uint256 _price,
        uint256 _availableTokens,
        uint256 _minPurchase,
        uint256 _maxPurchase
    ) external onlyAdmin unactivatedICO {
        require(duration > 0, "duration must be > 0");
        uint256 totalSupply = ERC20Token(token).totalSupply();
        require(
            _availableTokens > 0 && _availableTokens <= totalSupply,
            "totalSupply > 0 and <= totalSupply"
        );
        require(_minPurchase > 0, "MUST BE GREATER THAN 0");
        require(
            _maxPurchase > 0 && _maxPurchase <= _availableTokens,
            "Should be greater than 0 and greater or equal than totalSupply"
        );
        require(_minPurchase > 0, "_minPurchase MUST BE greater than 0");
        require(
            _maxPurchase > 0 && _maxPurchase <= _availableTokens,
            "Should be > 0 and <= availableTokens"
        );
        end = duration.add(block.timestamp);
        price = _price;
        availableTokens = _availableTokens;
        minPurchase = _minPurchase;
        maxPurchase = _maxPurchase;
    }

    function whitelist(address investor) external onlyAdmin {
        investors[investor] = true;
    }

    function buy() external payable onlyInvestors activeICO {
        require(msg.value % price == 0, "must send multiple of price");
        require(
            msg.value >= minPurchase && msg.value <= maxPurchase,
            "MUST SEND BTW MIN AND MAX"
        );
        uint256 quantity = price.mul(msg.value);
        require(quantity <= availableTokens, "not enough tokens left for sale");
        sales.push(Sale(msg.sender, quantity));
    }

    function release()
        external
        onlyAdmin
        endOfICO
        tokensNotReleased
        nonReentrant
    {
        ERC20Token tokenInstance = ERC20Token(token);
        for (uint256 i = 0; i < sales.length; i++) {
            Sale storage sale = sales[i];
            tokenInstance.transfer(sale.investor, sale.volume);
        }
    }

    function withdraw(address payable to, uint256 amount)
        external
        onlyAdmin
        endOfICO
        tokensReleased
        nonReentrant
    {
        to.transfer(amount);
    }
}
