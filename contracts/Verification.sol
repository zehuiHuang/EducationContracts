pragma solidity 0.4.24;

contract Verification {
    address public student;
    address public creator;
    address[] public educators;
    mapping(bytes32 => address[2]) public EducatorOfFile;

    event NewFile(bytes32 sha3File, address[2] signers);
    event NewEducator(address educator);
		event DelEducator(address educator);

    /**
     * an encoded RSA signature form of data
     */
    struct Sig {
        bytes32 file;
        uint8 v;
        bytes32 r;
        bytes32 s;
    }


    /**
     * modifier
     * 
     * make function can only call by one of educators
     */
    modifier onlyEducator {
        bool has = false;
        for (uint i = 0; i < educators.length; i++) {
            if (msg.sender == educators[i]) {
                has = true;
            }
        }
        require(has == true);
        _;
    }

    /**
     * modifier
     *
     * only creator
     */
    modifier onlyCreator {
        require(msg.sender == creator);
        _;
    }

    /**
     * @notice Constructor function 
     * 
     * @dev Initializes contract with creator and the 
     * student which this contract belongs to
     *
     * @param studentRelated   the student that this contract belongs to
     */
    constructor(address studentRelated) public {
        student = studentRelated;
        creator = msg.sender;
        educators.push(msg.sender);
    }


    /**
     * decode a rsa signature and return the address
     */
    function _sigDecode(Sig s) private pure returns(address) {
        return ecrecover(s.file, s.v, s.r, s.s);
    }

		function _insertFile(
		    bytes32 sha3file,
        uint8 edu0_v,
				bytes32 edu0_r,
				bytes32 edu0_s,
        uint8 edu1_v,
        bytes32 edu1_r,
        bytes32 edu1_s
		) public onlyEducator {
	      address edu0 = _sigDecode(
								Sig(sha3file, edu0_v, edu0_r, edu0_s)
				);
				address edu1 = _sigDecode(
								Sig(sha3file, edu1_v, edu1_r, edu1_s)
				);
        EducatorOfFile[sha3file] = [edu0, edu1]; 
        emit NewFile(sha3file, [edu0, edu1]);
		}

    /**
     * @notice add multisig file
     *
     * @dev param mySigned must be the sender himself, 
     * and the sender must be one of the educators
     * 
     * @param sha3file    the file to be signed
     * @param stu_v       student's v of rsa
     * @param stu_r       student's r of rsa
     * @param stu_s       student's s of rsa
     * @param edu0_v         my v of rsa
     * @param edu0_r        my r of rsa
     * @param edu0_s        my s of ras
		 * @param edu1_v      v
		 * @param edu1_r      r
		 * @param edu1_s      s
     */
    function addMultisigFile(
        bytes32 sha3file,
        uint8 stu_v,
        bytes32 stu_r,
        bytes32 stu_s,
				uint8 edu0_v,
				bytes32 edu0_r,
				bytes32 edu0_s,
        uint8 edu1_v,
        bytes32 edu1_r,
        bytes32 edu1_s
    ) public onlyEducator {
        require(student == _sigDecode(Sig(sha3file, stu_v, stu_r, stu_s)));
        require(msg.sender == creator);
	      _insertFile(
					sha3file,
					edu0_v,
					edu0_r,
					edu0_s,
					edu1_v,
					edu1_r,
					edu1_s
				);		            
				return;
		}

		/*
		 * @notice view signers of sha3file
		 * @param sha3file
		 * @return signers
		 */
		function verifyFile(bytes32 sha3file) public view returns(address[2]) {
			return EducatorOfFile[sha3file];
		}

    /**
     * @notice add an educator by creator
     * @param educator    the educator to be added
     */
    function addEducator(
        address educator
    ) public onlyCreator {
        educators.push(educator);
        emit NewEducator(educator);
    }

    /**
     * @notice delete educator
     */
    function delEducator(
        address educator
    ) public onlyCreator {
        for (uint i = 0; i < educators.length; i++) {
            if (educators[i] == educator) {
                emit DelEducator(educator);
                delete educators[i];
            }
        }
    }

}
