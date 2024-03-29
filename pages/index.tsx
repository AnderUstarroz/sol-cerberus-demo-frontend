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
import { format, addMinutes } from "date-fns";
import {
  demo_pda,
  get_demo_program,
  get_provider,
  add_rules_instructions,
  get_balances,
  myAppId,
} from "../components/utils/sol-cerberus-demo";
import {
  appPda,
  rolePda,
  rulePda,
  shortKey,
  RolesByAddressType,
  namespaces,
  SolCerberus,
  AddressByRoleType,
  CachedPermsType,
  addressTypes,
  NFTAddressType,
  CollectionAddressType,
} from "sol-cerberus-js";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  ErrorType,
  AssignRoleType,
  DemoType,
  PDAsType,
  NewRuleType,
  ResourceDataType,
  ResourceType,
} from "../types/index-types";
import { DEFAULT_SELECT_STYLES, flashMsg } from "../components/utils/helpers";
import { human_number } from "../components/utils/number";
import { Tooltip } from "react-tooltip";
import Select from "react-select";
import { format_time } from "../components/utils/date";

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
const ResourceForm = dynamic(() => import("../components/resource-form"));
const Checkbox = dynamic(() => import("../components/checkbox"));

export default function Home({ cluster }) {
  const { publicKey, wallet, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const router = useRouter();
  const [demoProgram, setDemoProgram] =
    useState<anchor.Program<SolCerberusDemo> | null>(null);
  const [solCerberus, setSolCerberus] = useState<SolCerberus | null>(null);
  const [permissions, setPermissions] = useState<CachedPermsType>({});
  const [metaplex, setMetaplex] = useState<Metaplex | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [demo, setDemo] = useState<DemoType | null>(null);
  const [rotateShape, setRotateShape] = useState<boolean>(false);
  const [appChanged, setAppChanged] = useState<Date>(new Date());
  const [assignRole, setAssignRole] = useState<AssignRoleType>({
    role: null,
    address: "",
    type: null,
    expiresAt: null,
    loading: false,
    useCustomRole: false,
  });
  const [assignRoleError, setAssignRoleError] = useState<ErrorType>({});
  const [newRule, setNewRule] = useState<NewRuleType>({
    role: null,
    resource: null,
    permission: null,
    loading: false,
  });
  const [myRoles, setMyRoles] = useState<AddressByRoleType>(null);
  const [resourceData, setResourceData] = useState<ResourceDataType>({
    func: null,
    resource: "Square",
    action: "Add",
    size: 0,
    color: "",
  });
  const [newRuleErrors, setNewRuleErrors] = useState<ErrorType>({});
  const [roles, setRoles] = useState<string[]>([]);
  const [allAssignedRoles, setAllAssignedRoles] =
    useState<RolesByAddressType>(null);
  const [modals, setModals] = useState({
    main: false,
    roles: false,
    rules: false,
    resourceForm: false,
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
    let rolePDA = await rolePda(solCerberus.appId, assignRole.role, address);
    setAssignRole({ ...assignRole, loading: true });
    try {
      // Try to fetch the Role PDA, it should fail, otherwise it means that this assignation already exists!
      await solCerberus.program.account.role.fetch(rolePDA);
      // Only executed when Role is already assigned:
      flashMsg(
        <div>
          The role <strong>{assignRole.role}</strong> is already assigned to{" "}
          {shortKey(assignRole.address)}
        </div>
      );
      // Fetching the Role PDA should normally fail because is not supposed to exist yet:
    } catch (e) {
      try {
        // Assign Role to address:
        await solCerberus.assignRole(
          assignRole.role,
          assignRole.type as addressTypes,
          address,
          {
            expiresAt: assignRole.expiresAt ?? null,
          }
        );

        flashMsg(
          <div>
            Assigned role <strong>{assignRole.role}</strong> to{" "}
            {shortKey(assignRole.address)}
          </div>,
          "success"
        );
      } catch (e) {
        console.error(e);
        flashMsg(
          `Failed to assign role ${assignRole.role} to ${
            assignRole.type
          } ${shortKey(address)}`
        );
      }
    }
    setModals({ ...modals, roles: false });
    setAssignRole({
      role: null,
      address: "",
      type: null,
      expiresAt: null,
      loading: false,
      useCustomRole: false,
    });
  };

  const handleDeleteAssignedRole = async (
    role: string,
    type: string,
    address: string
  ) => {
    setModals({ ...modals, main: false });
    try {
      await solCerberus.deleteAssignedRole(role, type as addressTypes, address);

      flashMsg(
        <div>
          Deleted role <strong>{role}</strong> from {type} {shortKey(address)}
        </div>,
        "success"
      );
    } catch (e) {
      console.log(e);
      flashMsg(
        <div>
          Failed to delete role <strong>{role}</strong> from {type}{" "}
          {shortKey(address)}
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
    if (!errors.role && !/^[a-zA-Z0-9]+$/.test(assignRole.role)) {
      errors.role =
        "Invalid Role, must contain only numbers and letters: a-z, A-Z, 0-9";
    }
    if (assignRole.expiresAt && assignRole.expiresAt < new Date()) {
      errors.expiresAt =
        "The role is already expired! Please select a future date";
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
    let rulePDA = await rulePda(
      solCerberus.appId,
      newRule.role,
      newRule.resource,
      newRule.permission
    );
    setNewRule({ ...newRule, loading: true });
    try {
      // Try to fetch the Rule PDA, it should fail, otherwise it means that this assignation already exists!
      await solCerberus.program.account.rule.fetch(rulePDA);
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
        await solCerberus.addRule(
          newRule.role,
          newRule.resource,
          newRule.permission
        );

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
    setModals({ ...modals, main: false });
    try {
      await solCerberus.deleteRule(role, resource, permission);
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

  const defaultColor = (resource: ResourceType) => {
    if (demo[resource.toLowerCase()]) {
      return `#${demo[resource.toLowerCase()].color}`;
    } else if (resource === "Square") {
      return "#e3be59";
    } else if (resource === "Circle") {
      return "#35b7af";
    } else if (resource === "Triangle") {
      return "#bd2742";
    } else {
      return "#ffffff";
    }
  };

  const myCurrentLogin = () => {
    const [address, assignedData] = Object.entries(
      Object.values(myRoles)[0]
    )[0];
    return (
      <>
        <span className="capitalize">{assignedData.addressType}</span> (
        <strong>{shortKey(address)}</strong>)
      </>
    );
  };

  /**
   * Defines the default APP so users can find it when they close the browser
   *  and come back connecting with a diferent wallet.
   */
  const setDefaultApp = async (defaultDemo: DemoType) => {
    sessionStorage.setItem(
      "DefaultSolCerberusAPP",
      defaultDemo.authority.toBase58()
    );
  };

  const handleInitialize = async () => {
    const latestBlockHash = await connection.getLatestBlockhash();
    const transaction = new Transaction(latestBlockHash);
    transaction.feePayer = publicKey;
    transaction.add(
      (await solCerberus.initializeApp("SolCerberusDemo", null, {
        getIx: true,
        cached: true,
      })) as TransactionInstruction
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
    (await add_rules_instructions(solCerberus)).map((r: any) =>
      transaction.add(r.value)
    );
    // Check if user has enough balance
    const [balance, rentCost, txFee] = await get_balances(
      connection,
      publicKey,
      transaction,
      112 + 162 + 111 * 9 // Required account space (Demo: 112, SC APP: 162, SC Rule: 111 each)
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

  const refreshDemo = async (program, demoPda: PublicKey) => {
    const defaultApp = await program.account.demo.fetch(demoPda);
    setDefaultApp(defaultApp);
    setDemo(defaultApp);
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
      sc = new SolCerberus(connection, wallet, {
        appId: scAppId,
        appChangedCallback: async () => setAppChanged(new Date()),
      });
      setSolCerberus(sc);
      [scAppPda, demoPda] = (
        await Promise.allSettled([appPda(scAppId), demo_pda(scAppId)])
      )
        .filter((r: any) => r.status === "fulfilled")
        .map((r: any) => r.value);
    } catch (e) {
      flashMsg(`Invalid APP ID ${appIdStr}`);
      console.error(`Invalid APP ID ${appIdStr}`);
      return (window.location.href = "/");
    }
    const appData = await sc.fetchAppData();
    const demoProg = get_demo_program(provider);
    setPdas({ scAppPda: scAppPda, demoPda: demoPda });
    setDemoProgram(demoProg);
    if (appData) {
      setPermissions(await sc.fetchPerms());
      setAllAssignedRoles((await sc.fetchAllRoles()) as RolesByAddressType);
      setMetaplex(new Metaplex(connection));
      try {
        await refreshDemo(demoProg, demoPda);
      } catch (e) {
        if (appIdStr !== myAppId(publicKey)) {
          console.error(`Invalid APP ID ${appIdStr}`);
          return (window.location.href = "/");
        }
      }
    }
    setLoading(false);
  };

  const clearAccounts = () => {
    solCerberus.disconnect();
    setPdas({ scAppPda: null, demoPda: null });
    setDemoProgram(null);
    setDemo(null);
    setSolCerberus(null);
    setAllAssignedRoles(null);
    setMetaplex(null);
    setMyRoles(null);
  };

  const isAdmin = (): boolean => {
    return (
      !!publicKey &&
      !!demo &&
      publicKey.toBase58() === demo.authority.toBase58()
    );
  };

  const fetchMyRoles = async () => {
    // No need to fetch roles for admin
    if (isAdmin()) return;
    let allMyRoles: AddressByRoleType = {};
    let myNfts: [NFTAddressType, CollectionAddressType][] = [];
    // Add my Wallet's address
    let addresses = [publicKey.toBase58()];
    // Add NFT and Collection roles
    const allNFTs: FindNftsByOwnerOutput = await metaplex
      .nfts()
      .findAllByOwner({ owner: publicKey });
    // A collection mint map is required when authenticating via NFT Collection
    // otherwise we wouldn't know which NFT was authorized for having an allowed collection.
    const collectionMintsMap = {};
    allNFTs.map((nft) => {
      let nftMint: PublicKey = null;
      // Check if specific NFT has roles assigned
      if (nft.hasOwnProperty("mintAddress")) {
        // @ts-ignore
        nftMint = nft.mintAddress;
      } else if (nft.hasOwnProperty("mint")) {
        // @ts-ignore
        nftMint = nft.mint.address;
      }
      // Check if the NFT Collection has roles assigned
      if (nftMint) {
        let collectionMint = null;
        if (nft.hasOwnProperty("collection") && nft.collection) {
          collectionMint = nft.collection.address;
          // @ts-ignore
          addresses.push(collectionMint.toBase58()); // @ts-ignore
          collectionMintsMap[collectionMint.toBase58()] = nftMint;
        }

        addresses.push(nftMint.toBase58());
        myNfts.push([nftMint, collectionMint ?? nftMint]);
      }
    });
    for (const address of addresses) {
      if (allAssignedRoles.hasOwnProperty(address)) {
        Object.entries(allAssignedRoles[address]).map(([role, values]) => {
          if (!allMyRoles.hasOwnProperty(role)) {
            allMyRoles[role] = {};
          }
          allMyRoles[role][address] = values;
          // Add NFT mint address if authenticating via collection
          if (values.addressType === "collection") {
            if (!allMyRoles[role][address].nftMints) {
              allMyRoles[role][address].nftMints = [];
            }
            allMyRoles[role][address].nftMints.push(
              collectionMintsMap[address]
            );
          }
        });
      }
    }
    // Login using NFTs so user can get the roles assigned to his NFTs or collections.
    await solCerberus.login({ nfts: myNfts });
    setMyRoles(allMyRoles);
  };

  const addResource = async (
    resource: ResourceType,
    color: string,
    size: number
  ) => {
    setModals({ ...modals, resourceForm: false });
    try {
      await demoProgram.methods[`add${resource}`](color, size)
        .accounts({
          demo: pdas.demoPda,
          ...(await solCerberus.accounts(resource, "Add")),
        })
        .rpc();
      flashMsg(`Added ${resource}`, "success");
    } catch (e) {
      console.log(e);
      if (solCerberus.isAnchorError(e)) {
        flashMsg(`${e.error.errorCode.code}: ${e.error.errorMessage}`);
      }
    }
  };

  const updateResource = async (
    resource: ResourceType,
    color: string,
    size: number
  ) => {
    setModals({ ...modals, resourceForm: false });
    try {
      await demoProgram.methods[`update${resource}`](color, size)
        .accounts({
          demo: pdas.demoPda,
          ...(await solCerberus.accounts(resource, "Update")),
        })
        .rpc();
      flashMsg(`Updated ${resource}`, "success");
    } catch (e) {
      console.log(e);
      if (solCerberus.isAnchorError(e)) {
        flashMsg(`${e.error.errorCode.code}: ${e.error.errorMessage}`);
      }
    }
  };

  const deleteResource = async (resource: ResourceType) => {
    setModals({ ...modals, main: false });
    try {
      await demoProgram.methods[`delete${resource}`]()
        .accounts({
          demo: pdas.demoPda,
          ...(await solCerberus.accounts(resource, "Delete")),
        })
        .rpc();
      flashMsg(`Deleted ${resource}`, "success");
    } catch (e) {
      console.log(e);
      if (solCerberus.isAnchorError(e)) {
        flashMsg(`${e.error.errorCode.code}: ${e.error.errorMessage}`);
      }
    }
  };

  // STEP 1 - Initialize Demo
  useEffect(() => {
    // Clear states when changed Wallet or disconnected
    if (
      !publicKey ||
      (solCerberus && solCerberus.wallet.toBase58() != publicKey.toBase58())
    ) {
      // Clear all data when user's wallet has been disconnected
      if (solCerberus) {
        clearAccounts();
      }
      return;
    }
    if (!router.isReady || solCerberus) return;
    // Get APP ID from query param or generate one from our wallet
    let appId = router.query.id
      ? (router.query.id as string)
      : myAppId(publicKey);
    // The APP ID must be defined as query param to facilitate other wallets accessing the APP.
    if (!router.query.id) {
      router.push(`/?id=${appId}`, undefined, {
        shallow: true,
      });
    }
    (async () => {
      await initAccounts(appId);
    })();
    return () => {
      if (solCerberus) {
        solCerberus.disconnect();
      }
    };
  }, [router.isReady, publicKey, solCerberus]);

  // STEP 2 - Obtain all roles assigned to my Wallet, NFTs or collections whenever roles change
  useEffect(() => {
    if (!allAssignedRoles || !metaplex) return;
    // Define available roles
    setRoles([
      ...new Set(
        Object.values(allAssignedRoles).reduce(
          (result, roles) => {
            Object.keys(roles).map((role) => result.push(role));
            return result;
          },
          ["SquareMaster", "CircleMaster", "TriangleMaster"]
        )
      ),
    ]);
    if (!myRoles) {
      fetchMyRoles();
    }
  }, [allAssignedRoles, metaplex]);

  // STEP 3 - Refresh Demo on every update
  useEffect(() => {
    if (!demoProgram || !pdas) return;
    let demoWebsocket = connection.onAccountChange(
      pdas.demoPda,
      (_: any, _context: any) => refreshDemo(demoProgram, pdas.demoPda),
      "confirmed"
    );
    return () => {
      if (demoWebsocket) connection.removeAccountChangeListener(demoWebsocket);
    };
  }, [demoProgram, pdas]);

  // Rotate Shapes whenever demo is updated
  useEffect(() => {
    setRotateShape(!rotateShape);
  }, [demo]);

  // Refreshes Roles or Rules whenever the SC APP is updated.
  useEffect(() => {
    if (!solCerberus || !demo) return;
    (async () => {
      solCerberus.appData.rolesUpdatedAt > solCerberus.appData.rulesUpdatedAt
        ? setAllAssignedRoles(
            (await solCerberus.fetchAllRoles()) as RolesByAddressType
          )
        : setPermissions(await solCerberus.fetchPerms());
    })();
  }, [appChanged]);

  return (
    <>
      <Head>
        <title>Sol Cerberus Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AnimatePresence>
        {!publicKey && (
          <ConnectWallet setMainModalContent={setMainModalContent} />
        )}{" "}
      </AnimatePresence>
      <AnimatePresence>
        {loading && (
          <motion.div className={styles.loading} {...DEFAULT_ANIMATION}>
            <Spinner />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!!publicKey && !loading && !demo && (
          <InitializeDemo initialize={handleInitialize} />
        )}{" "}
      </AnimatePresence>
      <AnimatePresence>
        {!!publicKey && demo && (
          <motion.div className={styles.container} {...DEFAULT_ANIMATION}>
            <Logo />
            <h1>
              <span>Sol</span> Cerberus Demo
            </h1>
            <p>The new authority</p>
            <section>
              <h2>Description</h2>
              <fieldset className={styles.desc}>
                <p>
                  Discover how easy is to enhance security in your Solana
                  programs. In this demo you can play with three available
                  roles:
                </p>
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
                  however you like. Try assigning some roles to different
                  wallets or NFTs, then disconnect and connect with them to test
                  them out.
                </p>
                <h3 className="mb-med">Demo only available in Devnet</h3>
                <p>
                  This demo <strong>only works on Devnet</strong>. Make sure
                  your Solana wallet is configured to use the Devnet network.
                </p>

                <p className={styles.github}>
                  <a
                    className="link aligned gap5"
                    href="https://github.com/AnderUstarroz/sol-cerberus-demo"
                    target="_blank"
                  >
                    Source code available on Github
                    <Icon cType="github" />
                  </a>
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
                  Assign roles to wallets, NFTs or to entire NFT collections.
                  Only Admin wallet (<strong>{shortKey(demo.authority)}</strong>
                  ) can modify roles.
                </p>
                <table>
                  <thead>
                    <tr>
                      <th>Address</th>
                      <th>Role</th>
                      <th>Type</th>
                      <th>Expires</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <motion.tr {...DEFAULT_ANIMATION}>
                      <td>{shortKey(demo.authority)}</td>
                      <td>Admin</td>
                      <td>Wallet</td>
                      <td>Never</td>
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
                                  <td>{shortKey(address)}</td>
                                  <td>
                                    <strong className={role}>{role}</strong>
                                  </td>
                                  <td className="capitalize">
                                    {data.addressType}
                                  </td>
                                  <td>
                                    {data.expiresAt ? (
                                      data.expiresAt < new Date().getTime() ? (
                                        <span
                                          className="aligned"
                                          style={{ gap: 3, color: "#bd2742" }}
                                        >
                                          <Icon
                                            cType="exclamation"
                                            width={17}
                                            height={17}
                                          />{" "}
                                          Expired
                                        </span>
                                      ) : (
                                        format_time(new Date(data.expiresAt))
                                      )
                                    ) : (
                                      "Never"
                                    )}
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
                                                  {shortKey(address)}
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
                    <div>
                      <p>
                        Your are currently logged in as <strong>Admin</strong> (
                        <strong>{shortKey(demo.authority)}</strong>) you are
                        allowed to do everything!
                      </p>
                      <p>
                        Try assigning some roles to other wallets or NFTs, then
                        disconnect and connect them to test access.
                      </p>
                    </div>
                  ) : myRoles && Object.keys(myRoles).length ? (
                    <p>
                      Your are currently logged in via {myCurrentLogin()} and
                      have the following roles assigned:{" "}
                      {Object.keys(myRoles).map((role, index: number) => (
                        <span key={`myroles${index}`}>
                          <span className={role}>{role}</span>
                          {index < Object.keys(myRoles).length - 1 ? ", " : "."}
                        </span>
                      ))}
                    </p>
                  ) : (
                    <p>
                      You are connected via wallet{" "}
                      <strong>{shortKey(publicKey)}</strong>, but have no roles
                      assigned.
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
                  Manage the permissions allowed for each role on each resource.
                  Only Admin wallet (<strong>{shortKey(demo.authority)}</strong>
                  ) can modify permissions.
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
                      {!!Object.keys(permissions).length &&
                        Object.entries(permissions[namespaces.Rule]).map(
                          ([role, resources], k0: number) =>
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
                                                    Do you really want to delete
                                                    the permission:{" "}
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
                                                      <strong>
                                                        {permission}
                                                      </strong>
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
            {["Square", "Circle", "Triangle"].map((resource: ResourceType) => (
              <section key={`${resource}-shape`}>
                <h2>{resource}</h2>
                <div className={styles.shapeBox}>
                  <div>
                    <div className="shape">
                      <span
                        className={resource}
                        style={{
                          transform: `${
                            rotateShape ? "rotate(2turn)" : "rotate(0turn)"
                          } scale(${
                            demo[resource.toLowerCase()]
                              ? demo[resource.toLowerCase()].size
                              : 0
                          })`,
                        }}
                      ></span>
                    </div>
                    <div className={"shapeBtns"}>
                      <div>
                        <div
                          data-tooltip-id={`addBtn-${resource}`}
                          data-tooltip-content={
                            demo[resource.toLowerCase()]
                              ? `${resource} already exists`
                              : null
                          }
                        >
                          <Button
                            className="big button1"
                            disabled={!!demo[resource.toLowerCase()]}
                            onClick={() => {
                              setResourceData({
                                func: addResource,
                                resource: resource,
                                action: "Add",
                                size: demo[resource.toLowerCase()]
                                  ? demo[resource.toLowerCase()].size
                                  : 200,
                                color: defaultColor(resource),
                              });
                              setModals({ ...modals, resourceForm: true });
                            }}
                          >
                            Add
                          </Button>
                          <Tooltip id={`addBtn-${resource}`} />
                        </div>
                        {solCerberus.hasPerm(resource, "Add") ? (
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
                        <div
                          data-tooltip-id={`updateBtn-${resource}`}
                          data-tooltip-content={
                            demo[resource.toLowerCase()]
                              ? null
                              : `Need to add ${resource} first`
                          }
                        >
                          <Button
                            className="big button1"
                            disabled={!demo[resource.toLowerCase()]}
                            onClick={() => {
                              setResourceData({
                                func: updateResource,
                                resource: resource,
                                action: "Update",
                                size: demo[resource.toLowerCase()]
                                  ? demo[resource.toLowerCase()].size
                                  : 200,
                                color: defaultColor(resource),
                              });
                              setModals({ ...modals, resourceForm: true });
                            }}
                          >
                            Update
                          </Button>
                          <Tooltip id={`updateBtn-${resource}`} />
                        </div>
                        {solCerberus.hasPerm(resource, "Update") ? (
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
                        <div
                          data-tooltip-id={`deleteBtn-${resource}`}
                          data-tooltip-content={
                            demo[resource.toLowerCase()]
                              ? null
                              : `Need to add ${resource} first`
                          }
                        >
                          <Button
                            className="big button2"
                            disabled={!demo[resource.toLowerCase()]}
                            onClick={() =>
                              setMainModalContent(
                                <>
                                  <h3>Delete {resource}</h3>
                                  <p className="mb-big">
                                    Do you really want to delete the{" "}
                                    <strong className={`${resource}Master`}>
                                      {resource}
                                    </strong>
                                    ?
                                  </p>
                                  <div className="aligned centered">
                                    <Button
                                      className="button2"
                                      onClick={() => deleteResource(resource)}
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
                          >
                            Delete
                          </Button>
                          <Tooltip id={`deleteBtn-${resource}`} />
                        </div>
                        {solCerberus.hasPerm(resource, "Delete") ? (
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
            ))}
            <style jsx>{`
              .SquareMaster {
                color: ${defaultColor("Square")};
              }
              span.Square {
                background-color: ${defaultColor("Square")};
              }
              .CircleMaster {
                color: ${defaultColor("Circle")};
              }
              span.Circle {
                background-color: ${defaultColor("Circle")};
              }
              .TriangleMaster {
                color: ${defaultColor("Triangle")};
              }
              span.Triangle {
                border-bottom-color: ${defaultColor("Triangle")};
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
      <Modal modalId={"main"} modals={modals} setIsOpen={setModals}>
        {mainModal}
      </Modal>
      <Modal modalId={"roles"} modals={modals} setIsOpen={setModals}>
        <h3>Assign role</h3>
        <p className="mb-big">Assign role to a Wallet, NFT or Collection.</p>
        {assignRole.loading ? (
          <Spinner />
        ) : (
          <>
            <div className="aligned mb-med">
              <label
                className={styles.checkbox}
                onClick={(e) =>
                  setAssignRole({
                    ...assignRole,
                    useCustomRole: !assignRole.useCustomRole,
                    role: "",
                  })
                }
              >
                <Checkbox
                  id="useCustomRole"
                  name="useCustomRole"
                  value={assignRole.useCustomRole}
                />
                Custom role
              </label>
              <AnimatePresence>
                {assignRole.useCustomRole ? (
                  <motion.label
                    className="overlap fullCol"
                    {...DEFAULT_ANIMATION}
                  >
                    <Input
                      className="fullWidth"
                      autoComplete="off"
                      value={assignRole.role}
                      style={
                        assignRoleError.role
                          ? {
                              borderColor: "#BD2742",
                            }
                          : undefined
                      }
                      maxLength="16"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setAssignRole({
                          ...assignRole,
                          role: e.target.value,
                        })
                      }
                      onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                        handleValidateAssignRole("role")
                      }
                    />
                    <span>Role</span>
                  </motion.label>
                ) : (
                  <motion.label
                    className="overlap fullCol"
                    {...DEFAULT_ANIMATION}
                  >
                    <Select
                      className="fullWidth"
                      placeholder="Select role.."
                      name="role"
                      options={roles.map((role) => {
                        return {
                          value: role,
                          label: role,
                        };
                      })}
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
                            color: defaultColor(state.data.value.slice(0, -6)),
                          };
                        },
                        option: (baseStyles: any, state: any) => {
                          return {
                            ...DEFAULT_SELECT_STYLES.option(baseStyles, state),
                            color: defaultColor(state.data.value.slice(0, -6)),
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
                        setAssignRole({
                          ...assignRole,
                          role: option?.value,
                        });
                      }}
                      onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                        handleValidateAssignRole("role")
                      }
                    />{" "}
                    <span>Role</span>
                  </motion.label>
                )}
              </AnimatePresence>
            </div>
            <div>
              <div className="aligned mobileCols mb-med">
                <label className="overlap fullCol">
                  <Select
                    className="fullWidth"
                    placeholder="Select type.."
                    name="type"
                    options={[
                      { value: "wallet", label: "Wallet" },
                      { value: "nft", label: "NFT" },
                      { value: "collection", label: "Collection" },
                    ]}
                    value={
                      assignRole.type
                        ? {
                            value: assignRole.type,
                            label: {
                              nft: "NFT",
                              wallet: "Wallet",
                              collection: "Collection",
                            }[assignRole.type] as string,
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
              <div className="flex mb-med">
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
                  <Button
                    cType="transparent"
                    data-tooltip-id="assign-address-input"
                    data-tooltip-content={
                      "The public key of a Wallet, NFT or Collection"
                    }
                  >
                    <Icon cType="info" className="icon3" />
                  </Button>
                </label>
              </div>
              <div className="aligned mb-big">
                <label
                  className={styles.checkbox}
                  onClick={(e) =>
                    setAssignRole({
                      ...assignRole,
                      expiresAt: assignRole.expiresAt
                        ? null
                        : new Date(
                            addMinutes(new Date(), 5).setSeconds(0) // Remove seconds
                          ),
                    })
                  }
                >
                  <Checkbox
                    id="useExpiration"
                    name="useExpiration"
                    value={!!assignRole.expiresAt}
                  />
                  Temporary role
                </label>
                <AnimatePresence>
                  {!!assignRole.expiresAt && (
                    <motion.label
                      className="overlap fullCol"
                      {...DEFAULT_ANIMATION}
                    >
                      <Input
                        type="datetime-local"
                        name="openTime"
                        className="fullWidth"
                        style={
                          assignRoleError.expiresAt
                            ? {
                                borderColor: "#BD2742",
                              }
                            : undefined
                        }
                        value={format(
                          assignRole.expiresAt,
                          "yyyy-MM-dd'T'HH:mm"
                        )}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setAssignRole({
                            ...assignRole,
                            expiresAt: new Date(
                              new Date(e.target.value).setSeconds(0) // Remove seconds
                            ),
                          })
                        }
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                          handleValidateAssignRole("expiresAt")
                        }
                      />
                      <span>Expires</span>
                      <Button
                        cType="transparent"
                        data-tooltip-id="assign-expiresAt-input"
                        data-tooltip-content={
                          "The role will be effective until the provided date"
                        }
                      >
                        <Icon cType="info" className="icon3" />
                      </Button>
                    </motion.label>
                  )}
                </AnimatePresence>
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
              <Tooltip id="assign-expiresAt-input" />
              <Tooltip id="assign-address-input" />
            </div>
          </>
        )}
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
                    options={roles.map((role) => {
                      return {
                        value: role,
                        label: role,
                      };
                    })}
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
                          color: defaultColor(state.data.value.slice(0, -6)),
                        };
                      },
                      option: (baseStyles: any, state: any) => {
                        return {
                          ...DEFAULT_SELECT_STYLES.option(baseStyles, state),
                          color: defaultColor(state.data.value.slice(0, -6)),
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
      <Modal modalId={"resourceForm"} modals={modals} setIsOpen={setModals}>
        <ResourceForm
          data={resourceData}
          setData={setResourceData}
          modals={modals}
          setModals={setModals}
        />
      </Modal>
    </>
  );
}
