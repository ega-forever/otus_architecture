import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract OtusToken is ERC20Detailed, ERC20 {

    constructor(string memory name, string memory symbol, uint8 decimals, uint256 initialSupply) ERC20Detailed (name, symbol, decimals) public {
        _mint(_msgSender(), initialSupply * (10 ** uint256(decimals)));
    }

}