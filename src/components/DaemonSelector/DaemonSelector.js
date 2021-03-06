import React, { useEffect, useState } from "react"

import CenterMiddle from "./CenterMiddle"
import Header from "../Header/Header"
import loadingBar from "../loadingBar"
import EthereumConfig from "./EthereumConfig"
import config from "../../../ethereum_config"

const url_params = window && new URLSearchParams(window.location.search)

const DaemonSelector = (props) => {
    const [showConfigLoader, setShowConfigLoader] = useState(false)
    const [showMnemonic, setShowMnemonic] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [save, setSave] = useState(
        localStorage.getItem("save") === "true" || false
    )

    const url = new URL(window.location.href)

    const [connecting, setConnecting] = useState(false)
    const [mnemonic, setMnemonic] = useState(
        localStorage.getItem("mnemonic") || ""
    )
    const [uuid, setUuid] = useState(
        url.searchParams.get("uuid") || localStorage.getItem("uuid") || ""
    )

    const [endpoint, setEndpoint] = useState(
        url.searchParams.get("endpoint") ||
            localStorage.getItem("endpoint") ||
            config[0].endpoint
    )

    useEffect(() => {
        localStorage.setItem("save", save.toString())
        localStorage.setItem("uuid", uuid)
        localStorage.setItem("endpoint", endpoint)
        if (save) {
            localStorage.setItem("mnemonic", mnemonic)
        } else {
            localStorage.setItem("mnemonic", "")
        }
    }, [endpoint, uuid, save, mnemonic])

    const go = async () => {
        const new_url_params = location.pathname + "?" + url_params.toString()

        window.history.pushState("", "", new_url_params)

        setConnecting(true)

        try {
            await props.go(endpoint, uuid, mnemonic || "")
        } catch (e) {
            console.error(e)
            alert(
                "Error occured while connecting! Please make sure that the information is correct!"
            )
            setConnecting(false)
        }
    }

    const checkEnterKey = (ev) => {
        ev.keyCode === 13 && go()
    }

    const toggleModal = () => setShowModal(!showModal)

    return (
        <CenterMiddle>
            <Header />
            <div onKeyUp={checkEnterKey}>
                <BS.Card style={{ marginTop: 20 }}>
                    <div style={{ width: 700, padding: 20 }}>
                        {showConfigLoader && (
                            <BS.Alert color='primary'>
                                Loading config parameters from Heroku...
                            </BS.Alert>
                        )}

                        <BS.Form>
                            <BS.FormGroup row>
                                <BS.Label sm={3} for='mnemonic'>
                                    Mnemonic:
                                </BS.Label>
                                <BS.Col sm={9}>
                                    <BS.InputGroup>
                                        <BS.Input
                                            type={
                                                showMnemonic
                                                    ? "text"
                                                    : "password"
                                            }
                                            name='mnemonic'
                                            value={mnemonic}
                                            onChange={(e) =>
                                                setMnemonic(e.target.value)
                                            }
                                        />
                                        <BS.InputGroupAddon addonType='append'>
                                            <BS.Button
                                                outline={showMnemonic}
                                                color='secondary'
                                                type='button'
                                                onClick={() =>
                                                    setShowMnemonic(
                                                        !showMnemonic
                                                    )
                                                }>
                                                <i className='far fa-eye'></i>
                                            </BS.Button>
                                            <BS.Button
                                                outline={!save}
                                                color='warning'
                                                type='button'
                                                id='saveButton'
                                                onClick={() => setSave(!save)}>
                                                <i className='fas fa-thumbtack'></i>
                                            </BS.Button>
                                            {/* <BS.Button
                                                outline
                                                color='secondary'
                                                type='button'
                                                onClick={toggleModal}>
                                                <i className='far fa-question-circle'></i>
                                            </BS.Button> */}
                                        </BS.InputGroupAddon>

                                        <BS.UncontrolledTooltip
                                            placement='top'
                                            target='saveButton'>
                                            Save key
                                        </BS.UncontrolledTooltip>
                                    </BS.InputGroup>
                                </BS.Col>
                            </BS.FormGroup>

                            <hr />
                            <EthereumConfig
                                endpoint={endpoint}
                                uuid={uuid}
                                setEndpoint={setEndpoint}
                                setUuid={setUuid}
                            />
                            <hr />

                            <div style={{ marginTop: 10, textAlign: "center" }}>
                                {connecting === false ? (
                                    <BS.Button
                                        color='primary'
                                        style={{ width: "100%" }}
                                        onClick={go}>
                                        Go
                                    </BS.Button>
                                ) : (
                                    loadingBar
                                )}
                            </div>
                        </BS.Form>

                        <BS.Modal isOpen={showModal} toggle={toggleModal}>
                            <BS.ModalHeader toggle={toggleModal}>
                                ECDSA Keys
                            </BS.ModalHeader>
                            <BS.ModalBody>
                                <p>
                                    Cryptography secures the database content
                                    from bad actors. Your identity is a{" "}
                                    <em>mnemonic</em>. BluzelleStudio uses your
                                    mnemonic key to sign off database
                                    operations. The key is only used locally
                                    within this webpage; it is never uploaded
                                    anywhere.
                                </p>

                                <hr />

                                <p>
                                    Bluzelle uses the elliptic curve digital
                                    signature algorithm (<strong>ECDSA</strong>)
                                    on the curve <strong>secp256k1</strong> with
                                    an <strong>SHA-256</strong> hash. To emulate
                                    different users, use different keys.
                                </p>

                                <hr />

                                <p>
                                    With OpenSSL installed, run{" "}
                                    <code>
                                        openssl ecparam -name secp256k1 -genkey
                                        -noout -out my_private_key.pem
                                    </code>
                                    . This will write the private key to a file
                                    called <code>my_private_key.pem</code>.
                                    Upload that file to BluzelleStudio.
                                </p>

                                <p>
                                    Alternatively, navigate to{" "}
                                    <a href='https://keytool.online/'>
                                        https://keytool.online/
                                    </a>
                                    , select "ECDSA" and "P-256k" as the key
                                    type. Copy the private key and save it into
                                    a file on your computer. Upload that file to
                                    BluzelleStudio.
                                </p>

                                <p>The file should looks like this:</p>

                                <div style={{ overflow: "scroll" }}>
                                    <code style={{ whiteSpace: "pre" }}>
                                        {
                                            "-----BEGIN EC PRIVATE KEY-----\nMHQCAQEEIFNmJHEiGpgITlRwao/CDki4OS7BYeI7nyz+CM8NW3xToAcGBSuBBAAK\noUQDQgAEndHOcS6bE1P9xjS/U+SM2a1GbQpPuH9sWNWtNYxZr0JcF+sCS2zsD+xl\nCcbrRXDZtfeDmgD9tHdWhcZKIy8ejQ==\n-----END EC PRIVATE KEY-----"
                                        }
                                    </code>
                                </div>
                            </BS.ModalBody>
                            <BS.ModalFooter></BS.ModalFooter>
                        </BS.Modal>
                    </div>
                </BS.Card>
            </div>
        </CenterMiddle>
    )
}

export default DaemonSelector
