pragma solidity 0.4.24;

import "./Verification.sol";



contract File {
    /* the student of the file*/
    address public student;
    /* the creator of the contract*/
    address public creator;
    /* the related verification contract address*/
    address public verification;
    /* the viewers list */
    address[] public viewers;
    /* the encrytped bytes*/
    bytes[] private  encryptedFiles;
		


    event NewEncryptedFile(bytes file, address uploader);
    event NewViewer(address viewer);
    event DelViewer(address viewer);

		Verification public v ;

    /**
     * modifier
     * 
     * only viewers
     */
    modifier onlyViewers {
        bool has = false;
        for (uint i = 0; i < viewers.length; i++) {
            if (msg.sender == viewers[i]) {
                has = true;
            }
        }
        require(has == true);
        _;
    }

    /**
     * modifier
     *
     * only student or creator
     */
    modifier onlyStudentOrCreator {
        bool has = false;
        if (msg.sender == student) {
            has = true;
        }
        if (msg.sender == creator) {
            has = true;
        }
        require(has == true);
        _;
    }

    /**
     * @notice Constructor function 
     * @dev Initializes creator\student and set the first viewer the creator
     * and deploy verification contract and init verification
     * @param studentRelated   the owner student of the file 
     */
    constructor (
						address studentRelated, 
						address verificationAddress
		) public {
        student = studentRelated;
        creator = msg.sender;
        viewers.push(msg.sender);
        viewers.push(student);
        verification = verificationAddress;
				v = Verification(verification);
    }

    /**
     * @notice decode the encrypted file 
     * @param encryptedFile the encrypted file 
     * @return string
     */
    function _decodeFile(bytes encryptedFile)
    private pure returns (bytes){
			  bytes memory output = encryptedFile; 
        for (uint i = 0; i < output.length / 2; i++) {
            byte t = output[i];
            output[i] =
                output[output.length - 1 - i];
            output[output.length - 1 - i] = t;
        }
				return output;
    }

    /**
		 *  
     */
    function uploadEncryptedFile(bytes file) public onlyViewers{
//				bytes32 sha3data = keccak256(_decodeFile(file));
//				address[2] memory addrs= v.verifyFile(sha3data);
//			  require(addrs[0] != 0x0 );
//				require(addrs[1] != 0x0 );
//				_decodeFile(file);
        encryptedFiles.push(file);
        emit NewEncryptedFile(file, msg.sender);
    }


		
		
		/**
		 * @notice get the number of files
		 * @return length of encryptedFile
		 */
    function getNumberOfFiles() public
    view onlyViewers returns(uint) {
        return encryptedFiles.length;
    }

    /**
		 * @notice view file by index
		 * @param index   index of file
		 * @return file   file string
		 */
    function viewFile(uint index) public
    view onlyViewers returns(string) {
        return string(
						_decodeFile(encryptedFiles[index])
				);
    }

    /**
     * @notice add a viewer by creator or student
     * @param viewer the viewer
     */
    function addViewer(address viewer)
    public onlyStudentOrCreator {
        viewers.push(viewer);
        emit NewViewer(viewer);
    }

    /**
     * @notice del a viewer by index
     * @param index   the viewer index of the array
     */
    function _delViewerByIndex(uint index)
    private {
        emit DelViewer(viewers[index]);
        delete viewers[index];
    }

    /**
		 * @notice delete del a viewer
		 * @param viewer   the viewer index of the array
		 */
    function delViewer(address viewer)
    public onlyStudentOrCreator {
        for (uint i = 0; i < viewers.length; i++) {
            if(viewers[i] == viewer) {
							_delViewerByIndex(i);
						}
        }
    }

}
