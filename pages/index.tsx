import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { DEFAULT_ANIMATION } from "../components/utils/animation";
import { ReactNode, useEffect, useState } from "react";
import { SolCerberusDemo } from "../sol_cerberus_demo";
import { Metaplex, FindNftsByOwnerOutput } from "@metaplex-foundation/js";
import { useRouter } from "next/router";
import {
  AddressAssignedRolesType,
  namespaces,
  SolCerberus,
} from "../components/utils/sol-cerberus-js";
import {
  demo_pda,
  get_demo_program,
  get_provider,
  add_rules_instructions,
  get_balances,
} from "../components/utils/sol-cerberus-demo";
import {
  sc_app_pda,
  sc_role_pda,
  sc_rule_pda,
  short_key,
} from "sol-cerberus-js";
import { LAMPORTS_PER_SOL, PublicKey, Transaction } from "@solana/web3.js";
import {
  ErrorType,
  AssignRoleType,
  DemoType,
  PDAsType,
  NewRuleType,
  AddresssesByRoleType,
} from "./index-types";
import { DEFAULT_SELECT_STYLES, flashMsg } from "../components/utils/helpers";
import { human_number } from "../components/utils/number";
import Select from "react-select";

// https://www.shutterstock.com/video/clip-28255210-sun-surface-solar-flares
// https://www.google.com/search?q=sun+burning+video&rlz=1C5CHFA_enES984ES984&oq=sun+burning+video&aqs=chrome..69i57j0i19i512l9.2381j0j7&sourceid=chrome&ie=UTF-8#fpstate=ive&vld=cid:e9eb4c89,vid:WBMl-JV0DoE

const ConnectWallet = dynamic(() => import("../components/connect-wallet"));
const InitializeDemo = dynamic(() => import("../components/initialize-demo"));
const Logo = dynamic(() => import("../components/logo"));
const Spinner = dynamic(() => import("../components/spinner"));
const Icon = dynamic(() => import("../components/icon"));
const Input = dynamic(() => import("../components/input"));
const Modal = dynamic(() => import("../components/modal"));
const Button = dynamic(() => import("../components/button"));

export default function Home() {
  const { publicKey, wallet, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const router = useRouter();
  const [demoProgram, setDemoProgram] =
    useState<anchor.Program<SolCerberusDemo> | null>(null);
  const [solCerberus, setSolCerberus] = useState<SolCerberus | null>(null);
  const [metaplex, setMetaplex] = useState<Metaplex | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [demo, setDemo] = useState<DemoType | null>(null);
  const [assignRole, setAssignRole] = useState<AssignRoleType>({
    role: null,
    address: "",
    type: null,
    loading: false,
  });
  const [assignRoleError, setAssignRoleError] = useState<ErrorType>({});
  const [newRule, setNewRule] = useState<NewRuleType>({
    role: null,
    resource: null,
    permission: null,
    loading: false,
  });
  const [myRoles, setMyRoles] = useState<AddresssesByRoleType>({});
  const [newRuleErrors, setNewRuleErrors] = useState<ErrorType>({});
  const [allAssignedRoles, setAllAssignedRoles] =
    useState<AddressAssignedRolesType>(null);
  const [modals, setModals] = useState({
    main: false,
    roles: false,
    rules: false,
  });
  const [pdas, setPdas] = useState<PDAsType>({
    scAppPda: null,
    demoPda: null,
  });
  const [mainModal, setMainModal] = useState<ReactNode>(null);

  const setMainModalContent = (content: any, show = true) => {
    if (show) {
      setMainModal(content);
    }
    setModals({ ...modals, main: show });
  };

  const handleAddAssignRole = async () => {
    if (!handleValidateAssignRole(null)) return;
    let address = new PublicKey(assignRole.address);
    let rolePda = await sc_role_pda(
      solCerberus.appId,
      assignRole.role,
      address
    );
    setAssignRole({ ...assignRole, loading: true });
    try {
      // Try to fetch the Role PDA, it should fail, otherwise it means that this assignation already exists!
      await solCerberus.program.account.role.fetch(rolePda);
      // Only executed when Role is already assigned:
      flashMsg(
        <div>
          The role <strong>{assignRole.role}</strong> is already assigned to{" "}
          {short_key(assignRole.address)}
        </div>
      );
      // Fetching the Role PDA should normally fail because is not supposed to exist yet:
    } catch (e) {
      try {
        // Assign Role to address:
        await solCerberus.program.methods
          .assignRole({
            address: address,
            role: assignRole.role,
            addressType: { [assignRole.type.toLowerCase()]: {} },
            expiresAt: null,
          })
          .accounts({
            app: pdas.scAppPda,
            role: rolePda,
          })
          .rpc();
        flashMsg(
          <div>
            Assigned role <strong>{assignRole.role}</strong> to{" "}
            {short_key(assignRole.address)}
          </div>,
          "success"
        );
      } catch (e) {
        console.error(e);
        flashMsg(
          `Failed to assign role ${assignRole.role} to ${
            assignRole.type
          } ${short_key(address)}`
        );
      }
    }
    setModals({ ...modals, roles: false });
    setAssignRole({
      role: null,
      address: "",
      type: null,
      loading: false,
    });
  };

  const handleDeleteAssignedRole = async (
    role: string,
    type: string,
    address: string
  ) => {
    try {
      await solCerberus.program.methods
        .deleteAssignedRole()
        .accounts({
          app: pdas.scAppPda,
          role: await sc_role_pda(
            solCerberus.appId,
            role,
            new PublicKey(address)
          ),
          collector: publicKey,
        })
        .rpc();
      flashMsg(
        <div>
          Deleted role <strong>{role}</strong> from {type} {short_key(address)}
        </div>,
        "success"
      );
    } catch (e) {
      console.log(e);
      flashMsg(
        <div>
          Failed to delete role <strong>{role}</strong> from {type}{" "}
          {short_key(address)}
        </div>
      );
    }
    setModals({ ...modals, main: false });
  };

  const handleValidateAssignRole = (field: string | null) => {
    setAssignRoleError({});
    let errors: { [k: string]: string } = {};
    ["role", "type", "address"].map((str: string) => {
      if (!assignRole[str]) {
        errors[str] = `${
          str.charAt(0).toUpperCase() + str.slice(1)
        } cannot be empty`;
      }
    });
    try {
      new PublicKey(assignRole.address);
    } catch (e) {
      errors.address = "Invalid address";
    }
    if (Object.keys(errors).length) {
      setAssignRoleError(
        Object.entries(errors).reduce((acc, [error, errorMsg]) => {
          if (error === field || !field) {
            flashMsg(errorMsg);
            acc[error] = errorMsg;
          }
          return acc;
        }, {})
      );
      return false;
    }
    return true;
  };

  const handleValidateNewRule = async (field: string | null) => {
    setNewRuleErrors({});
    let errors: { [k: string]: string } = {};
    ["role", "resource", "permission"].map((str: string) => {
      if (!newRule[str]) {
        errors[str] = `${
          str.charAt(0).toUpperCase() + str.slice(1)
        } cannot be empty`;
      }
    });
    if (Object.keys(errors).length) {
      setNewRuleErrors(
        Object.entries(errors).reduce((acc, [error, errorMsg]) => {
          if (error === field || !field) {
            flashMsg(errorMsg);
            acc[error] = errorMsg;
          }
          return acc;
        }, {})
      );
      return false;
    }
    return true;
  };

  const handleNewRule = async () => {
    if (!handleValidateNewRule(null)) return;
    let rulePda = await sc_rule_pda(
      solCerberus.appId,
      newRule.role,
      newRule.resource,
      newRule.permission
    );
    setNewRule({ ...newRule, loading: true });
    try {
      // Try to fetch the Rule PDA, it should fail, otherwise it means that this assignation already exists!
      await solCerberus.program.account.rule.fetch(rulePda);
      // This part is only executed if Rule already exists:
      flashMsg(
        <div>
          The following permission already exists:{" "}
          <span className="aligned gap5">
            <strong>{newRule.role}</strong>
            <Icon cType="chevron" direction="right" />
            <strong>{newRule.resource}</strong>
            <Icon cType="chevron" direction="right" />
            <strong>{newRule.permission}</strong>{" "}
          </span>
        </div>
      );
      // Fetching the Rule PDA should normally fail because is not supposed to exist yet:
    } catch (e) {
      try {
        // Add new rule:
        await solCerberus.program.methods
          .addRule({
            namespace: namespaces.Default,
            role: newRule.role,
            resource: newRule.resource,
            permission: newRule.permission,
            expiresAt: null,
          })
          .accounts({
            app: pdas.scAppPda,
            rule: rulePda,
          })
          .rpc();
        flashMsg(
          <div>
            Created new permission:{" "}
            <span className="aligned gap5">
              <strong>{newRule.role}</strong>
              <Icon cType="chevron" direction="right" />
              <strong>{newRule.resource}</strong>
              <Icon cType="chevron" direction="right" />
              <strong>{newRule.permission}</strong>
            </span>
          </div>,
          "success"
        );
      } catch (e) {
        console.error(e);
        flashMsg(
          <div>
            Failed to create new permission:{" "}
            <span className="aligned gap5">
              <strong>{newRule.role}</strong>
              <Icon cType="chevron" direction="right" />
              <strong>{newRule.resource}</strong>
              <Icon cType="chevron" direction="right" />
              <strong>{newRule.permission}</strong>
            </span>
          </div>
        );
      }
    }
    setModals({ ...modals, rules: false });
    setNewRule({
      role: null,
      resource: null,
      permission: null,
      loading: false,
    });
  };

  const handleDeleteRule = async (
    role: string,
    resource: string,
    permission: string
  ) => {
    try {
      await solCerberus.program.methods
        .deleteRule()
        .accounts({
          app: pdas.scAppPda,
          rule: await sc_rule_pda(
            solCerberus.appId,
            role,
            resource,
            permission
          ),
          collector: publicKey,
        })
        .rpc();
      flashMsg(
        <div>
          Deleted permission:{" "}
          <span className="aligned gap5">
            {role} <Icon cType="chevron" direction="right" />
            {resource} <Icon cType="chevron" direction="right" />
            {permission}
          </span>
        </div>,
        "success"
      );
    } catch (e) {
      console.log(e);
      flashMsg(
        <div>
          Failed to delete permission:{" "}
          <span className="aligned gap5">
            {role} <Icon cType="chevron" direction="right" />
            {resource} <Icon cType="chevron" direction="right" />
            {permission}
          </span>
        </div>
      );
    }
    setModals({ ...modals, main: false });
  };

  const defaultColor = (shape: string) => {
    if (demo[shape]) {
      return `#${demo[shape].color}`;
    } else if (shape === "square") {
      return "#e3be59";
    } else if (shape === "circle") {
      return "#35b7af";
    } else {
      return "#bd2742";
    }
  };

  const myAppId = (): string => {
    return `CeRb3rUs${publicKey.toBase58().slice(8)}`;
  };

  const handleInitialize = async () => {
    const latestBlockHash = await connection.getLatestBlockhash();
    const transaction = new Transaction(latestBlockHash);
    transaction.feePayer = publicKey;
    transaction.add(
      await solCerberus.program.methods
        .initializeApp({
          id: solCerberus.appId,
          recovery: null,
          name: "SolCerberusDemo",
        })
        .accounts({
          app: pdas.scAppPda,
          authority: publicKey,
        })
        .instruction()
    );
    transaction.add(
      await demoProgram.methods
        .initializeDemo(solCerberus.appId)
        .accounts({
          demo: pdas.demoPda,
          authority: publicKey,
        })
        .instruction()
    );

    // Add Permissions to all roles and resources:
    //    "SquareMaster"    -> "Square"   -> [Add", "Update", "Delete"]
    //    "CircleMaster"    -> "Circle"   -> [Add", "Update", "Delete"]
    //    "TriangleMaster"  -> "Triangle" -> [Add", "Update", "Delete"]
    (await add_rules_instructions(solCerberus, publicKey, pdas.scAppPda)).map(
      (r: any) => transaction.add(r.value)
    );

    // Check if user has enough balance
    const [balance, rentCost, txFee] = await get_balances(
      connection,
      publicKey,
      transaction,
      112 + 126 + 119 * 9 // Required account space
    );
    const totalCost = txFee + rentCost;
    if (totalCost > balance) {
      return flashMsg(
        `Not enough balance! You need at least ${human_number(
          totalCost / LAMPORTS_PER_SOL,
          9
        )} SOL, but you only have ${human_number(
          balance / LAMPORTS_PER_SOL,
          9
        )} SOL`
      );
    }
    setLoading(true);
    try {
      const tx = await sendTransaction(transaction, connection);
      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: tx,
      });
      initAccounts(solCerberus.appId.toBase58());
    } catch (e) {}
    setLoading(false);
  };

  const initAccounts = async (appIdStr: string) => {
    setLoading(true);
    const provider: anchor.Provider = get_provider(connection, wallet);
    let scAppId: PublicKey;
    let sc: SolCerberus;
    let scAppPda: PublicKey;
    let demoPda: PublicKey;
    try {
      scAppId = new PublicKey(appIdStr);
      sc = new SolCerberus(scAppId, provider);
      [scAppPda, demoPda] = (
        await Promise.allSettled([sc_app_pda(scAppId), demo_pda(scAppId)])
      )
        .filter((r: any) => r.status === "fulfilled")
        .map((r: any) => r.value);
    } catch (e) {
      flashMsg(`Invalid APP ID ${appIdStr}`);
      console.error(`Invalid APP ID ${appIdStr}`);
      return (window.location.href = "/");
    }
    const demoProg = get_demo_program(provider);
    setPdas({ scAppPda: scAppPda, demoPda: demoPda });
    setDemoProgram(demoProg);
    setSolCerberus(sc);
    setAllAssignedRoles(await sc.allAssignedRoles());
    setMetaplex(new Metaplex(connection));
    try {
      setDemo(await demoProg.account.demo.fetch(demoPda));
    } catch (e) {
      if (appIdStr !== myAppId()) {
        console.error(`Invalid APP ID ${appIdStr}`);
        return (window.location.href = "/");
      }
    }

    setLoading(false);
  };

  const clearAccounts = () => {
    setPdas({ scAppPda: null, demoPda: null });
    setDemoProgram(null);
    setDemo(null);
    setSolCerberus(null);
    setAllAssignedRoles(null);
    setMetaplex(null);
    setMyRoles({});
  };

  const isAdmin = (): boolean => {
    return (
      !!publicKey &&
      !!demo &&
      publicKey.toBase58() === demo.authority.toBase58()
    );
  };

  const fetchMyRoles = async () => {
    let allMyRoles: AddresssesByRoleType = {};
    const rolesByAddress = Object.entries(allAssignedRoles).reduce(
      (acc, [address, roles]) => {
        acc[address] = Object.keys(roles);
        return acc;
      },
      {}
    );
    // Add Wallet's roles
    if (rolesByAddress.hasOwnProperty(publicKey.toBase58())) {
      rolesByAddress[publicKey.toBase58()].map((role: string) => {
        allMyRoles[role] = allMyRoles.hasOwnProperty(role)
          ? [...allMyRoles[role], publicKey.toBase58()]
          : [publicKey.toBase58()];
      });
    }
    // Add NFT and Collection roles
    const allNFTs: FindNftsByOwnerOutput = await metaplex
      .nfts()
      .findAllByOwner({ owner: publicKey });
    allNFTs.map((nft) => {
      let addresses = [];
      // Check if specific NFT has roles assigned
      if (nft.hasOwnProperty("mintAddress")) {
        // @ts-ignore
        addresses.push(nft.mintAddress.toBase58());
      } else if (nft.hasOwnProperty("mint")) {
        // @ts-ignore
        addresses.push(nft.mint.address.toBase58());
      }
      // Check if specific NFT Collection has roles assigned
      if (nft.hasOwnProperty("collection") && nft.collection) {
        // @ts-ignore
        addresses.push(nft.collection.address.toBase58());
      }
      for (const address of addresses) {
        if (rolesByAddress.hasOwnProperty(address)) {
          rolesByAddress[address].map((role: string) => {
            allMyRoles[role] = allMyRoles.hasOwnProperty(role)
              ? [...allMyRoles[role], address]
              : [address];
          });
        }
      }
    });
    setMyRoles(allMyRoles);
  };

  // STEP 1 - Initialize Demo
  useEffect(() => {
    if (!publicKey) {
      // Clear all data when user's wallet has been disconnected
      if (solCerberus) {
        clearAccounts();
      }
      return;
    }
    if (solCerberus) return;
    // Get APP ID from query param or generate one from our wallet
    let appId = router.query.id ? (router.query.id as string) : myAppId();
    // The APP ID must be defined as query param to facilitate other wallets accessing the APP.
    if (!router.query.id) {
      router.push(`/?id=${appId}`, undefined, { shallow: true });
    }
    (async () => {
      await initAccounts(appId);
    })();
  }, [publicKey, solCerberus]);

  // STEP 2 - Obtain all roles assigned to my Wallet, NFTs or collections
  useEffect(() => {
    if (!allAssignedRoles || !metaplex || Object.keys(myRoles).length) return;
    fetchMyRoles();
  }, [allAssignedRoles, metaplex, myRoles]);

  return (
    <>
      <Head>
        <title>Sol Cerberus Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AnimatePresence>{!publicKey && <ConnectWallet />} </AnimatePresence>
      {loading && (
        <div className={styles.loading}>
          <Spinner />
        </div>
      )}
      <AnimatePresence>
        {!loading && !demo && <InitializeDemo initialize={handleInitialize} />}
      </AnimatePresence>
      {!!publicKey && demo && (
        <div className={styles.container}>
          <Logo />
          <h1>
            <span>Sol</span> Cerberus Demo
          </h1>
          <p>
            Discover how easy is to enhance security in your Solana programs
          </p>
          <section>
            <h2>Description</h2>
            <fieldset className={styles.desc}>
              <p>In this demo you will find three available roles:</p>
              <ul className="sqList">
                <li>
                  <strong className="SquareMaster">SquareMaster</strong> (Can
                  add, update or delete the resource{" "}
                  <span className="SquareMaster">Square</span>)
                </li>
                <li>
                  <strong className="CircleMaster">CircleMaster</strong> (Can
                  add, update or delete the resource{" "}
                  <span className="CircleMaster">Circle</span>)
                </li>
                <li>
                  <strong className="TriangleMaster">TriangleMaster</strong>{" "}
                  (Can add, update or delete the resource{" "}
                  <span className="TriangleMaster">Triangle</span>)
                </li>
              </ul>
              <p>
                Initially each one of these roles can control just his
                corresponding resource, but you can modify the permissions
                anyway you like.
              </p>
            </fieldset>
          </section>
          <section>
            <h2>
              Assign roles{" "}
              {isAdmin() && (
                <span
                  className="icon1"
                  onClick={() => setModals({ ...modals, roles: true })}
                >
                  +
                </span>
              )}
            </h2>
            <fieldset>
              <p>
                Assign roles to wallets, NFTs or to entire NFT collections (only
                Admin)
              </p>
              <table>
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>Role</th>
                    <th>Type</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <motion.tr {...DEFAULT_ANIMATION}>
                    <td>{short_key(demo.authority)}</td>
                    <td>Admin</td>
                    <td>Wallet</td>
                    <td></td>
                  </motion.tr>
                  <AnimatePresence>
                    {!!allAssignedRoles &&
                      Object.entries(allAssignedRoles).map(
                        ([address, roles], k0: number) =>
                          Object.entries(roles).map(
                            ([role, data]: any, k1: number) => (
                              <motion.tr
                                key={`assign${k0}-${k1}`}
                                {...DEFAULT_ANIMATION}
                              >
                                <td>{short_key(address)}</td>
                                <td>
                                  <strong className={role}>{role}</strong>
                                </td>

                                <td className="capitalize">
                                  {data.addressType}
                                </td>
                                <td>
                                  {isAdmin() && (
                                    <Icon
                                      cType="close"
                                      width={10}
                                      height={10}
                                      className="icon2"
                                      onClick={() =>
                                        setMainModalContent(
                                          <>
                                            <h3>Delete assigned role</h3>
                                            <p className="mb-big">
                                              Do you really want to delete the
                                              role{" "}
                                              <strong className={role}>
                                                {role}
                                              </strong>{" "}
                                              assigned to the{" "}
                                              <strong className="capitalize">
                                                {data.addressType}
                                              </strong>
                                              :{" "}
                                              <strong>
                                                {short_key(address)}
                                              </strong>
                                              ?
                                            </p>
                                            <div className="aligned centered">
                                              <Button
                                                className="button2"
                                                onClick={() =>
                                                  handleDeleteAssignedRole(
                                                    role,
                                                    data.addressType,
                                                    address
                                                  )
                                                }
                                              >
                                                Delete
                                              </Button>
                                              <Button
                                                className="button1"
                                                onClick={() =>
                                                  setModals({
                                                    ...modals,
                                                    main: false,
                                                  })
                                                }
                                              >
                                                Cancel
                                              </Button>
                                            </div>
                                          </>
                                        )
                                      }
                                    />
                                  )}
                                </td>
                              </motion.tr>
                            )
                          )
                      )}
                  </AnimatePresence>
                </tbody>
              </table>
              <div className={styles.loggedMsg}>
                <Icon cType="info" width={30} height={30} />
                {publicKey.toBase58() === demo.authority.toBase58() ? (
                  <p>
                    Your are currently logged in as <strong>Admin</strong> (
                    <strong>{short_key(demo.authority)}</strong>) you are
                    allowed to do everything!
                  </p>
                ) : (
                  <p>
                    Your are currently logged in with wallet{" "}
                    <strong>{short_key(publicKey)}</strong> and have{" "}
                    {Object.keys(myRoles).length ? (
                      <>
                        the following roles assigned:{" "}
                        {Object.keys(myRoles).map((role, index: number) => (
                          <span key={`myroles${index}`}>
                            <span className={role}>{role}</span>
                            {index < Object.keys(myRoles).length - 1
                              ? ", "
                              : "."}
                          </span>
                        ))}
                      </>
                    ) : (
                      "no roles assigned."
                    )}
                  </p>
                )}
              </div>
            </fieldset>
          </section>
          <section>
            <h2>
              Permissions{" "}
              {isAdmin() && (
                <span
                  className="icon1"
                  onClick={() => setModals({ ...modals, rules: true })}
                >
                  +
                </span>
              )}
            </h2>
            <fieldset>
              <p>
                Manage the permissions allowed for each role on each resource
                (only Admin)
              </p>
              <table>
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Resource</th>
                    <th>Permission</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {!!solCerberus.permissions &&
                      Object.entries(
                        solCerberus.permissions.perms[namespaces.Default]
                      ).map(([role, resources], k0: number) =>
                        Object.entries(resources).map(
                          ([resource, permissions], k1: number) =>
                            Object.entries(permissions).map(
                              ([permission, data], k2: number) => (
                                <motion.tr
                                  key={`perm-${k0}${k1}${k2}`}
                                  {...DEFAULT_ANIMATION}
                                >
                                  <td>
                                    <strong className={role}>{role}</strong>
                                  </td>
                                  <td className={`${resource}Master`}>
                                    {resource}
                                  </td>
                                  <td>{permission}</td>
                                  <td>
                                    {isAdmin() && (
                                      <Icon
                                        cType="close"
                                        width={10}
                                        height={10}
                                        className="icon2"
                                        onClick={() =>
                                          setMainModalContent(
                                            <>
                                              <h3>Delete permission</h3>
                                              <p className="mb-med">
                                                Do you really want to delete the
                                                permission:{" "}
                                              </p>
                                              <p className="mb-big">
                                                <span className="aligned gap5">
                                                  <strong className={role}>
                                                    {role}
                                                  </strong>
                                                  <Icon
                                                    cType="chevron"
                                                    direction="right"
                                                  />
                                                  <strong
                                                    className={`${resource}Master`}
                                                  >
                                                    {resource}
                                                  </strong>
                                                  <Icon
                                                    cType="chevron"
                                                    direction="right"
                                                  />
                                                  <strong>{permission}</strong>
                                                </span>
                                              </p>
                                              <div className="aligned centered">
                                                <Button
                                                  className="button2"
                                                  onClick={() =>
                                                    handleDeleteRule(
                                                      role,
                                                      resource,
                                                      permission
                                                    )
                                                  }
                                                >
                                                  Delete
                                                </Button>
                                                <Button
                                                  className="button1"
                                                  onClick={() =>
                                                    setModals({
                                                      ...modals,
                                                      main: false,
                                                    })
                                                  }
                                                >
                                                  Cancel
                                                </Button>
                                              </div>
                                            </>
                                          )
                                        }
                                      />
                                    )}
                                  </td>
                                </motion.tr>
                              )
                            )
                        )
                      )}
                  </AnimatePresence>
                </tbody>
              </table>
            </fieldset>
          </section>
          <section>
            <h2>Square</h2>
            <div className={styles.shapeBox}>
              <div>
                <div className="shape">
                  {demo.square ? <span className="square"></span> : "Empty"}
                </div>
                <div className={"shapeBtns"}>
                  <div>
                    <Button className="big button1">Add</Button>
                    {solCerberus.hasPerm(
                      Object.keys(myRoles),
                      "Square",
                      "Add"
                    ) ? (
                      <span>
                        <Icon
                          cType="valid"
                          color="#35b7af"
                          width={10}
                          height={10}
                        />{" "}
                        Allowed
                      </span>
                    ) : (
                      <span>
                        <Icon
                          cType="forbidden"
                          color="#bd2742"
                          width={10}
                          height={10}
                        />{" "}
                        Not allowed
                      </span>
                    )}
                  </div>
                  <div>
                    <Button className="big button1">Update</Button>
                    {solCerberus.hasPerm(
                      Object.keys(myRoles),
                      "Square",
                      "Update"
                    ) ? (
                      <span>
                        <Icon
                          cType="valid"
                          color="#35b7af"
                          width={10}
                          height={10}
                        />{" "}
                        Allowed
                      </span>
                    ) : (
                      <span>
                        <Icon
                          cType="forbidden"
                          color="#bd2742"
                          width={10}
                          height={10}
                        />{" "}
                        Not allowed
                      </span>
                    )}
                  </div>
                  <div>
                    <Button className="big button2">Delete</Button>
                    {solCerberus.hasPerm(
                      Object.keys(myRoles),
                      "Square",
                      "Delete"
                    ) ? (
                      <span>
                        <Icon
                          cType="valid"
                          color="#35b7af"
                          width={10}
                          height={10}
                        />{" "}
                        Allowed
                      </span>
                    ) : (
                      <span>
                        <Icon
                          cType="forbidden"
                          color="#bd2742"
                          width={10}
                          height={10}
                        />{" "}
                        Not allowed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <style jsx>{`
            .SquareMaster {
              color: ${defaultColor("square")};
            }
            .CircleMaster {
              color: ${defaultColor("circle")};
            }
            .TriangleMaster {
              color: ${defaultColor("triangle")};
            }
          `}</style>
        </div>
      )}
      <Modal modalId={"main"} modals={modals} setIsOpen={setModals}>
        {mainModal}
      </Modal>
      <Modal modalId={"roles"} modals={modals} setIsOpen={setModals}>
        <h3>Assign role</h3>
        <p className="mb-big">Assign role to: Wallet, NFT, Collection</p>
        <div>
          {assignRole.loading ? (
            <Spinner />
          ) : (
            <>
              <div className="aligned mobileCols mb-med">
                <label className="overlap fullCol">
                  <Select
                    className="fullWidth"
                    placeholder="Select role.."
                    name="role"
                    options={[
                      { value: "SquareMaster", label: "SquareMaster" },
                      { value: "CircleMaster", label: "CircleMaster" },
                      { value: "TriangleMaster", label: "TriangleMaster" },
                    ]}
                    value={
                      assignRole.role
                        ? {
                            value: assignRole.role,
                            label: assignRole.role,
                          }
                        : null
                    }
                    styles={{
                      ...DEFAULT_SELECT_STYLES,
                      singleValue: (baseStyles: any, state: any) => {
                        return {
                          ...baseStyles,
                          color: defaultColor(
                            state.data.value.slice(0, -6).toLowerCase()
                          ),
                        };
                      },
                      option: (baseStyles: any, state: any) => {
                        return {
                          ...DEFAULT_SELECT_STYLES.option(baseStyles, state),
                          color: defaultColor(
                            state.data.value.slice(0, -6).toLowerCase()
                          ),
                        };
                      },
                      ...(assignRoleError?.role
                        ? {
                            container: (styles) => ({
                              ...styles,
                              border: "1px solid #BD2742",
                            }),
                          }
                        : {}),
                    }}
                    onChange={(option, _actionMeta) => {
                      const { role, ...otherErrors } = assignRoleError;
                      setAssignRoleError(otherErrors);
                      setAssignRole({ ...assignRole, role: option?.value });
                    }}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                      handleValidateAssignRole("role")
                    }
                  />
                  <span>Role</span>
                </label>
                <label className="overlap fullCol">
                  <Select
                    className="fullWidth"
                    placeholder="Select type.."
                    name="type"
                    options={[
                      { value: "Wallet", label: "Wallet" },
                      { value: "NFT", label: "NFT" },
                      { value: "Collection", label: "Collection" },
                    ]}
                    value={
                      assignRole.type
                        ? {
                            value: assignRole.type,
                            label: assignRole.type,
                          }
                        : null
                    }
                    styles={{
                      ...DEFAULT_SELECT_STYLES,
                      ...(assignRoleError?.type
                        ? {
                            container: (styles) => ({
                              ...styles,
                              border: "1px solid #BD2742",
                            }),
                          }
                        : {}),
                    }}
                    onChange={(option, _actionMeta) => {
                      const { type, ...otherErrors } = assignRoleError;
                      setAssignRoleError(otherErrors);
                      setAssignRole({ ...assignRole, type: option?.value });
                    }}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                      handleValidateAssignRole("type")
                    }
                  />
                  <span>Type</span>
                </label>
              </div>
              <div className="flex mb-big">
                <label className="overlap fullCol">
                  <Input
                    className="fullWidth"
                    autoComplete="off"
                    value={assignRole.address}
                    style={
                      assignRoleError.address
                        ? {
                            borderColor: "#BD2742",
                          }
                        : undefined
                    }
                    maxLength="44"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setAssignRole({ ...assignRole, address: e.target.value })
                    }
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                      handleValidateAssignRole("address")
                    }
                  />
                  <span>Address</span>
                </label>
              </div>
              <div className="aligned centered">
                <Button onClick={() => handleAddAssignRole()}>Add</Button>
                <Button
                  className="button1"
                  onClick={() => setModals({ ...modals, roles: false })}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
      <Modal modalId={"rules"} modals={modals} setIsOpen={setModals}>
        <h3>Add permission</h3>
        <p className="mb-big">
          Creates a new permission for certain role and resource.
        </p>
        <div>
          {newRule.loading ? (
            <Spinner />
          ) : (
            <>
              <div className="aligned mobileCols mb-med">
                <label className="overlap fullCol">
                  <Select
                    className="fullWidth"
                    placeholder="Select role.."
                    name="new-role"
                    options={[
                      { value: "SquareMaster", label: "SquareMaster" },
                      { value: "CircleMaster", label: "CircleMaster" },
                      { value: "TriangleMaster", label: "TriangleMaster" },
                    ]}
                    value={
                      newRule.role
                        ? {
                            value: newRule.role,
                            label: newRule.role,
                          }
                        : null
                    }
                    styles={{
                      ...DEFAULT_SELECT_STYLES,
                      singleValue: (baseStyles: any, state: any) => {
                        return {
                          ...baseStyles,
                          color: defaultColor(
                            state.data.value.slice(0, -6).toLowerCase()
                          ),
                        };
                      },
                      option: (baseStyles: any, state: any) => {
                        return {
                          ...DEFAULT_SELECT_STYLES.option(baseStyles, state),
                          color: defaultColor(
                            state.data.value.slice(0, -6).toLowerCase()
                          ),
                        };
                      },
                      ...(newRuleErrors?.role
                        ? {
                            container: (styles) => ({
                              ...styles,
                              border: "1px solid #BD2742",
                            }),
                          }
                        : {}),
                    }}
                    onChange={(option, _actionMeta) => {
                      const { role, ...otherErrors } = newRuleErrors;
                      setNewRuleErrors(otherErrors);
                      setNewRule({ ...newRule, role: option?.value });
                    }}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                      handleValidateNewRule("role")
                    }
                  />
                  <span>Role</span>
                </label>
                <label className="overlap fullCol">
                  <Select
                    className="fullWidth"
                    placeholder="Select one.."
                    name="new-resource"
                    options={[
                      { value: "Square", label: "Square" },
                      { value: "Circle", label: "Circle" },
                      { value: "Triangle", label: "Triangle" },
                      { value: "*", label: "* (all resources)" },
                    ]}
                    value={
                      newRule.resource
                        ? {
                            value: newRule.resource,
                            label: newRule.resource,
                          }
                        : null
                    }
                    styles={{
                      ...DEFAULT_SELECT_STYLES,
                      ...(newRuleErrors?.permission
                        ? {
                            container: (styles) => ({
                              ...styles,
                              border: "1px solid #BD2742",
                            }),
                          }
                        : {}),
                    }}
                    onChange={(option, _actionMeta) => {
                      const { resource, ...otherErrors } = newRuleErrors;
                      setNewRuleErrors(otherErrors);
                      setNewRule({ ...newRule, resource: option?.value });
                    }}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                      handleValidateNewRule("resource")
                    }
                  />
                  <span>Resource</span>
                </label>
              </div>
              <div className="flex mb-big">
                <label className="overlap fullCol">
                  <Select
                    className="fullWidth"
                    placeholder="Select permission.."
                    name="new-permission"
                    options={[
                      { value: "Add", label: "Add" },
                      { value: "Update", label: "Update" },
                      { value: "Delete", label: "Delete" },
                      { value: "*", label: "* (all permissions)" },
                    ]}
                    value={
                      newRule.permission
                        ? {
                            value: newRule.permission,
                            label: newRule.permission,
                          }
                        : null
                    }
                    styles={{
                      ...DEFAULT_SELECT_STYLES,
                      ...(newRuleErrors?.permission
                        ? {
                            container: (styles) => ({
                              ...styles,
                              border: "1px solid #BD2742",
                            }),
                          }
                        : {}),
                    }}
                    onChange={(option, _actionMeta) => {
                      const { resource, ...otherErrors } = newRuleErrors;
                      setNewRuleErrors(otherErrors);
                      setNewRule({ ...newRule, permission: option?.value });
                    }}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                      handleValidateNewRule("permission")
                    }
                  />
                  <span>Permission</span>
                </label>
              </div>
              <div className="aligned centered" style={{ paddingTop: 80 }}>
                <Button onClick={() => handleNewRule()}>Add</Button>
                <Button
                  className="button1"
                  onClick={() => setModals({ ...modals, rules: false })}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
