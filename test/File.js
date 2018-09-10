/*
 *
Accounts:
(0) 0x627306090abab3a6e1400e9345bc60c78a8bef57
(1) 0xf17f52151ebef6c7334fad080c5704d77216b732
(2) 0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef
(3) 0x821aea9a577a9b44299b9c15c88cf3087f3b5544
(4) 0x0d1d4e623d10f9fba5db95830f7d3839406c6af2
(5) 0x2932b7a2355d6fecc4b5c0b6bd44cc31df247a2e
(6) 0x2191ef87e392377ec08e7c08eb105ef5448eced5
(7) 0x0f4f2ac550a1b4e2280d04c21cea7ebd822934b5
(8) 0x6330a553fc93768f612722bb8c2ec78ac90b3bbc
(9) 0x5aeda56215b167893e80b4fe645ba6d5bab767de

Private Keys:
(0) c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3
(1) ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f
(2) 0dbbe8e4ae425a6d2687f1a7e3ba17bc98c673636790f1b8ad91193c05875ef1
(3) c88b703fb08cbea894b6aeff5a544fb92e78a18e19814cd85da83b71f772aa6c
(4) 388c684f0ba1ef5017716adb5d21a053ea8e90277d0868337519f97bede61418
(5) 659cbb0e2411a44db63778987b1e22153c086a95eb6b18bdf89de078917abc63
(6) 82d052c865f5763aad42add438569276c00d3d88a2d062d36b2bae914d58b8c8
(7) aa3680d5d48a8283413f7a108367c7299ca73f553735860a87b08f39395618b7
(8) 0f62d96d6675f32685bbdb8ac13cda7c23436f63efbb9d07700d8669ff12b7c4
(9) 8d5366123cb560bb606379f90a0bfd4769eecc0557f1b362dcae9012b548b1e5
 *
 */



let Promise = require("bluebird")
let File = artifacts.require("./File.sol")

const util = require("ethereumjs-util")
let Verification = artifacts.require("./Verification.sol")
let encode = require("./encode")

let stu = {
    address: "0xf17f52151ebef6c7334fad080c5704d77216b732",
    prikey: "ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f",
}

let edu = {
    address: "0x627306090abab3a6e1400e9345bc60c78a8bef57",
    prikey: "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3"
}

let edu0 = {
	  address: "0x821aea9a577a9b44299b9c15c88cf3087f3b5544",
    prikey: "c88b703fb08cbea894b6aeff5a544fb92e78a18e19814cd85da83b71f772aa6c"
}

let edu1 = {
	  address: "0x0d1d4e623d10f9fba5db95830f7d3839406c6af2",
	  prikey: "388c684f0ba1ef5017716adb5d21a053ea8e90277d0868337519f97bede61418"
}

//let stu = {
//    address: "0x65dd104db7d570121e33bcbfde55721cf2b1018f",
//    prikey: "ae157ea229549c0d4720bef322d1cf1ee0d8d5be5b4b5372eceffa135438a696",
//}
//
//let edu = {
//    address: "0xd0f1d390033d18617fb4d6835f561d5467f80756",
//    prikey: "e04d0925d14ee281a6293837db3bdb764aae63b0e426bc8a18eff9b2b7fad9bf"
//}

let BufferToHex = (buffer) => {
    return "0x" + buffer.toString("hex")
}

let FileInstance = {}
let VerificationInstance = {}


let data = JSON.stringify({
    address: "北京西二旗",
    email: "1283912803@qq.com",
    name: "Jonathan"
})
let sha3data = util.sha3(data)
let stuSigned = util.ecsign(
    sha3data,
    Buffer.from(stu.prikey, "hex"))
stuSigned.r = BufferToHex(stuSigned.r)
stuSigned.s = BufferToHex(stuSigned.s)
let eduSigned = util.ecsign(
    sha3data,
    Buffer.from(edu.prikey, "hex"))
eduSigned.r = BufferToHex(eduSigned.r)
eduSigned.s = BufferToHex(eduSigned.s)
let edu0Signed = util.ecsign(
    sha3data,
    Buffer.from(edu0.prikey, "hex"))
edu0Signed.r = BufferToHex(edu0Signed.r)
edu0Signed.s = BufferToHex(edu0Signed.s)
let edu1Signed = util.ecsign(
    sha3data,
    Buffer.from(edu1.prikey, "hex"))
edu1Signed.r = BufferToHex(edu1Signed.r)
edu1Signed.s = BufferToHex(edu1Signed.s)



sha3data = BufferToHex(sha3data)

let encrypted = encode(data)
console.log("encrypted:" +encrypted)

contract("File and Verification", function(accounts) {
    it("should deploy Verification contract correctly", () => {
        return Verification.new(stu.address, {
                from: edu.address
            })
            .then(instance => {
                VerificationInstance = instance
                return web3.eth.getTransactionReceipt(
                    instance.transactionHash)
            })
            .then(receipt => {
                assert(parseInt(receipt.status, 16) != 0,
                    "expect status to be 1(true)")
            })
    })

    it("student should be right", function() {
        return VerificationInstance.student.call()
            .then(ret => {
                assert(ret == stu.address)
            })
    })

    it(`creator should be right`, () => {
        return VerificationInstance.creator.call()
            .then(ret => {
                assert(ret == edu.address)
            })
    })

    it(`educators0 should be creator`, () => {
        return VerificationInstance.educators.call(0)
            .then(ret => {
                assert(ret == edu.address)
            })
    })

    it(`should add multisig file correctly when params are right`, () => {
        return VerificationInstance.addMultisigFile(
                sha3data,
                stuSigned.v,
                stuSigned.r,
                stuSigned.s,
                edu0Signed.v,
                edu0Signed.r,
                edu0Signed.s, 
								edu1Signed.v,
								edu1Signed.r,
								edu1Signed.s, {
                    from: edu.address
                }
            )
            .then(ret => {
                transactionHash = ret.tx
                assert(parseInt(ret.receipt.status, 16) != 0,
                    "expect status to be 1(true)")
                var eventNewFile = null
                for (var i = 0; i < ret.logs.length; i++) {
                    var log = ret.logs[i];
                    if (log.event == "NewFile")
                        eventNewFile = log
                }
                assert(eventNewFile != null,
                    'expect emit event NewFile')
                assert(eventNewFile.args.sha3File == sha3data,
                    "expect sha3file to be correct")
                assert(eventNewFile.args.signers[0] == edu0.address,
                    "expect educator to be correct")
            })
    })

    it(`should find the educators of one file`, () => {
        return VerificationInstance.verifyFile.call(sha3data)
            .then(ret => {
                assert(ret[0] == edu0.address && ret[1] == edu1.address,
                    "expect the signers to be right")
            })
    })

    it(`should add educator correctly`, () => {
        return VerificationInstance.addEducator(
                accounts[3], {
                    from: edu.address
                }
            )
            .then(ret => {
                transactionHash = ret.tx
                assert(parseInt(ret.receipt.status, 16) != 0,
                    "expect status to be 1(true)")
                var eventNewEducator = null
                for (var i = 0; i < ret.logs.length; i++) {
                    var log = ret.logs[i];
                    if (log.event == "NewEducator")
                        eventNewEducator = log
                }
                assert(eventNewEducator != null,
                    "expect emit event NewEducator")
                assert(eventNewEducator.args.educator == accounts[3],
                    "expect NewEducator to be account3")
            })
    })

    it(`should delete educator correctly`, () => {
        return VerificationInstance.delEducator(
                accounts[3], {
                    from: edu.address
                }
            )
            .then(ret => {
                transactionHash = ret.tx
                assert(parseInt(ret.receipt.status, 16) != 0,
                    "expect status to be 1(true)")
                var event = null
                for (var i = 0; i < ret.logs.length; i++) {
                    var log = ret.logs[i];
                    if (log.event == "DelEducator")
                        event = log
                }
                assert(event != null,
                    "expect emit event NewEducator")
                assert(event.args.educator == accounts[3],
                    "expect DelEducator to be account3")
            })
    })

    it("should deploy File contract correctly", () => {
        return File.new(stu.address, VerificationInstance.address, {
                from: edu.address
            })
            .then(instance => {
                FileInstance = instance
                return web3.eth.getTransactionReceipt(
                    FileInstance.transactionHash)
            })
            .then(receipt => {
                assert(parseInt(receipt.status, 16) != 0,
                    "expect status to be 1(true)")
                return FileInstance.verification.call()
            })
            .then(address => {
                assert(address != null,
                    "expect to have verification address")
                VerificationInstance = Verification.at(address)
            })

    })


    it("File's student should be right", function() {
        return FileInstance.student.call()
            .then(ret => {
                assert(ret == stu.address)
            })
    })

    it(`File's creator should be right`, () => {
        return FileInstance.creator.call()
            .then(ret => {
                assert(ret == edu.address)
            })
    })

    it(`File's viewer0 should be creator`, () => {
        return FileInstance.viewers.call(0)
            .then(ret => {
                assert(ret == edu.address)
            })
    })


    it(`should upload encrypted file correctly`, () => {
        return FileInstance.uploadEncryptedFile(
                encrypted, {
                    from: edu.address
                })
            .then(ret => {
                transactionHash = ret.tx
                assert(parseInt(ret.receipt.status, 16) != 0,
                    "expect status to be 1(true)")
                var event = null
                for (var i = 0; i < ret.logs.length; i++) {
                    var log = ret.logs[i];
                    if (log.event == "NewEncryptedFile")
                        event = log
                }
                assert(event != null,
                    "expect emit event NewEncryptedFile")
            })
    })


    it(`should upload encrypted file correctly`, () => {
        return FileInstance.uploadEncryptedFile(
                encrypted, {
                    from: edu.address
                })
            .then(ret => {
                transactionHash = ret.tx
                assert(parseInt(ret.receipt.status, 16) != 0,
                    "expect status to be 1(true)")
                var event = null
                for (var i = 0; i < ret.logs.length; i++) {
                    var log = ret.logs[i];
                    if (log.event == "NewEncryptedFile")
                        event = log
                }
                assert(event != null,
                    "expect emit event NewEncryptedFile")
            })
    })

    it(`should get files by one of viewers`, () => {
        let length = 0
        return FileInstance.getNumberOfFiles.call({
                from: stu.address
            })
            .then(ret => {
                length = ret
                let indexes = []
                for (let i = 0; i < length; i++) {
                    indexes.push(i)
                }
                return Promise.map(indexes, index => {
                    return FileInstance.viewFile.call(index, {
                        from: stu.address
                    })
                })
            })
            .then(ret => {
                assert(ret[0] != null,
                    "expect to have right string")
								console.log(ret)
            })
    })

})
