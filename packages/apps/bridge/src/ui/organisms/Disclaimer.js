import { useEffect, useState, useContext } from "react";
import { storeContext } from "../../api/global/global";
import { PrimaryRoundedButton } from "../atoms";

export const Disclaimer = () => {
  const [read, done] = useState(false);
  const [show, toggle] = useState(false);
  const { dispatch } = useContext(storeContext);

  useEffect(() => {
    let timer = setTimeout(() => {
      toggle(true);
      timer = null;
    }, 1000);
    return () => timer && clearTimeout(timer);
  });

  useEffect(() => {
    const scroll_box = document.getElementById("disclaimer");
    const listener = (e) => {
      if (
        scroll_box.scrollTop + window.innerHeight >=
        scroll_box.scrollHeight
      ) {
        done(true);
      }
    };
    scroll_box.addEventListener("scroll", listener);
    return () => scroll_box.removeEventListener("scroll", listener);
  });

  const sign = () => {
    if (read) {
      window.localStorage.setItem("TC_agreement_signed", "true");
      dispatch({ type: "UPDATE_TC", data: { tcSigned: true } });
      return;
    }
  };

  return (
    <div
      className={`flex w-full h-screen z-50 backdrop-blur-lg ${
        show ? "" : "hidden"
      }`}
    >
      <div className="w-full h-full md:w-2/5 md:h-5/6 mx-auto my-auto bg-white shadow-2xl grid grid-flow-cols justify-items-center px-10 py-5 gap-4 rounded-lg">
        <img src="/ZDBeta_logo-02.svg" alt="image" className="h-[70px]" />
        <h1 className="text-2xl font-medium underline">Terms and Conditions</h1>
        <div
          className="gap-3 flex flex-col overflow-scroll overflow-x-hidden md:p-8"
          id="disclaimer"
        >
          <p className="text-black snap-center">
            Welcome to bridge.zerodao.com (the "zeroDAO Site"). Z DAO, LLC
            ("ZD"), a Wyoming limited liability company, provides the zeroDAO
            Site and any files available thereon, as well as the Service (as
            defined below) to you subject to the following terms of use
            conditioned on your acceptance without modification of the terms,
            conditions, and notices contained herein (the "Terms"). Your use of
            the zeroDAO Site and the Service constitutes your agreement to all
            such Terms. Please read these terms carefully, and keep a copy of
            them for your reference.{" "}
            <span className="font-bold">
              {" "}
              YOU ACKNOWLEDGE THAT THE SERVICE IS CURRENTLY IN BETA AND THAT YOU
              USE IT AT YOUR OWN RISK.
            </span>
          </p>
          <p className="text-black snap-center">
            zeroDAO is an Ethereum Blockchain layer 2 solution enabling
            cross-chain liquidity through various means, including the RenVM.
            zeroDAO is a decentralized community of zeroDAO users holding the
            [LP] token, which is a cryptographic governance token used in the
            zeroDAO protocol (together, the “Open Source Software”) that
            permits, among other things, the ability to create and participate
            in liquidity pools. [LP] token holders may use their [LP] tokens to
            collectively govern certain rules of use of the Open Source
            Software, including participation in voting over some key aspects of
            the Open Source Software or the zeroDAO project (the “Voting”). Any
            [LP] token holder may participate in any Voting by independently
            interacting with the relevant smart contracts within the Open Source
            Software (the “Voting Contracts”). Some members and developers of
            the zeroDAO community and its Open Source Software (collectively the
            “zeroDAO Volunteers”) have provided you with a user interface,
            including the one available at zeroDAO.com and via other tools (the
            “Site”) — which includes text, files, images, audio, code and other
            materials (collectively, the “Content”) and all of the features, and
            services provided. The Site, the Voting Contracts, and any other
            features, tools, materials, the Open Source Software, or other
            services offered from time to time are referred to here as the
            “Service”.
          </p>
          <p className="text-black snap-center">
            Your use of the Service is at your own risk, and without any
            involvement or warranties of ZD. You acknowledge that the zeroDAO
            protocol and Software as well as Voting Contracts are subject to
            flaws and acknowledge that you are solely responsible for evaluating
            any code provided by the Services or Content. This warning and
            others later provided by ZD and zeroDAO Volunteers in no way
            evidence or represent an ongoing duty to alert you to all of the
            potential risks of utilizing the Service or Content. You acknowledge
            that it is your responsibility to utilize appropriate cyber security
            practices and software in your networks and on your devices.
          </p>
          <p className="text-black snap-center">
            ZD is a group of volunteer developers who are committed to
            furthering the usability of cryptocurrency. ZD operates educational
            and user resources in furtherance of the cross-chain liquidity
            achieved by the zeroDAO protocol and zeroDAO. ZD makes no money from
            the zeroDAO.com site, the files hosted or linked thereon, or the
            Service. ZD operates the zeroDAO.com domain name and various social
            media accounts. ZD receives no funding or support from zeroDAO users
            for these services.
          </p>
          <p className="text-black snap-center">
            ZD does not own or lead the zeroDAO protocol, but rather supports
            and develops the free, open-source protocol.
          </p>
          <p className="text-black snap-center">
            ZD has no role in the operation of markets or liquidity pools
            created on zeroDAO, and has no ability to spend funds that are held
            in proxy or escrow wallets, does not control how markets resolve or
            are created, do not approve or reject trades or other transactions
            on the network, and has no ability to modify, cancel, undo, or
            interact with orders on the network. ZD and the Forecast Foundation
            have no power to censor, restrict, or curate markets, orders,
            trades, positions or resolutions on the zeroDAO contracts. ZD has no
            more control over the zeroDAO protocol than anyone else using
            Ethereum.
          </p>
          <p className="text-black snap-center font-bold">
            PLEASE READ THIS TERMS CAREFULLY. THIS WEBSITE AND ANY OTHER
            WEBSITES OF ZD, ITS AFFILIATES OR AGENTS (ALSO THE "ZERODAO SITE")
            AND THE INFORMATION ON IT ARE CONTROLLED BY ZD. THESE TERMS OF USE
            GOVERN THE USE OF THE ZERODAO SITE AND APPLY TO ALL INTERNET USERS
            VISITING THE ZERODAO BY ACCESS OR USING THE ZERODAO SITE OR THE
            SERVICE IN ANY WAY, INCLUDING USING THE SERVICE AND RESOURCES
            AVAILABLE OR ENABLED VIA THE ZERODAO SITE. BY BROWSING THE ZERODAO
            SITE, YOU REPRESENT THAT (1) YOU HAVE READ, UNDERSTAND, AND AGREE TO
            BE BOUND BY THE TERMS OF USE, (2) YOU ARE OF LEGAL AGE TO FORM A
            BINDING CONTRACT WITH ZD, AND (3) YOU HAVE THE AUTHORITY TO ENTER
            INTO THE TERMS OF USE PERSONALLY OR ON BEHALF OF ANY COMPANY YOU
            HAVE NAMED AS THE USER, AND TO BIND THAT COMPANY TO THE TERMS OF
            USE. THE TERM "YOU" REFERS TO THE INDIVIDUAL OR LEGAL ENTITY, AS
            APPLICABLE, IDENTIFIED AS THE USER WHEN YOU'RE REGISTERED ON THE
            ZERODAO SITE. IF YOU DO NOT AGREE TO BE BOUND BY THE TERMS OF USE,
            YOU MAY NOT ACCESS OR USE THE ZERODAO SITE OR THE SERVICES.
          </p>
          <p className="text-black snap-center font-bold">
            PLEASE BE AWARE THAT THE DISPUTE RESOLUTION SECTION OF THIS
            AGREEMENT, BELOW, CONTAINS PROVISIONS GOVERNING HOW CLAIMS THAT YOU
            AND WE HAVE AGAINST EACH OTHER ARE RESOLVED, INCLUDING, WITHOUT
            LIMITATION, ANY CLAIMS THAT AROSE OR WERE ASSERTED PRIOR TO THE
            EFFECTIVE DATE OF THIS AGREEMENT. IN PARTICULAR, IT CONTAINS AN
            ARBITRATION AGREEMENT WHICH WILL, WITH LIMITED EXCEPTIONS, REQUIRE
            DISPUTES BETWEEN US TO BE SUBMITTED TO BINDING AND FINAL
            ARBITRATION. UNLESS YOU OPT OUT OF THE ARBITRATION AGREEMENT: (1)
            YOU WILL ONLY BE PERMITTED TO PURSUE CLAIMS AND SEEK RELIEF AGAINST
            US ON AN INDIVIDUAL BASIS, NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY
            CLASS OR REPRESENTATIVE ACTION OR PROCEEDING; AND (2) YOU ARE
            WAIVING YOUR RIGHT TO SEEK RELIEF IN A COURT OF LAW AND TO HAVE A
            JURY TRIAL ON YOUR CLAIMS.
          </p>
          <p className="text-black snap-center font-bold">
            ANY DISPUTE OR CLAIM RELATING IN ANY WAY TO YOUR USE OF THE ZERODAO
            SITE WILL BE GOVERNED AND INTERPRETED BY AND UNDER THE LAWS OF
            WYOMING, CONSISTENT WITH THE FEDERAL ARBITRATION ACT, WITHOUT GIVING
            EFFECT TO ANY PRINCIPLES THAT PROVIDE FOR THE APPLICATION OF THE LAW
            OF ANY OTHER JURISDICTION. THE UNITED NATIONS CONVENTION ON
            CONTRACTS FOR THE INTERNATIONAL SALE OF GOODS IS EXPRESSLY EXCLUDED
            FROM THIS AGREEMENT.
          </p>
          <h1 className="text-xl text-black font-extrabold mt-5">
            {" "}
            NOT BOILERPLATE{" "}
          </h1>
          <p className="text-black snap-center">
            These terms are not boilerplate. If you disagree with any of them,
            believe that any should not apply to you, or wish to negotiate these
            terms or the arbitration clause, please contact us at
            complaints@zdao.group and immediately navigate away from the zeroDAO
            Site. Do not use the zeroDAO Site until you and ZD have agreed upon
            new terms of use.
          </p>
          <h1 className="text-lg text-black font-bold">
            Electronic Communications
          </h1>
          <p className="text-black snap-center">
            Visiting the zeroDAO Site constitutes electronic communications. You
            consent to receive electronic communications and you agree that all
            agreements, notices, disclosures and other communications that we
            provide to you electronically, via the zeroDAO Site, satisfy any
            legal requirement that such communications be in writing. The
            foregoing does not affect your statutory rights.
          </p>
          <p className="text-black snap-center">
            ZD does not knowingly collect, either online or offline, personal
            information from any persons, including those under the age of
            eighteen. If you are under 18, you may not use the zeroDAO Site or
            enter into any transaction, unless you have the permission of your
            parent or guardian.
          </p>
          <h1 className="text-lg text-black font-bold"> Updates </h1>
          <p className="text-black snap-center">
            You understand that the zeroDAO Site and the related services are
            evolving. As a result, ZD may require you to accept updates to the
            zeroDAO Site and the related Service that you have previously
            installed or used. You acknowledge and agree that ZD may update the
            zeroDAO Site with or without notifying you. You may need to update
            third-party software from time to time in order to use the zeroDAO
            Site.
          </p>
          <h1 className="text-lg text-black font-bold">Third Party Services</h1>
          <p className="text-black snap-center">
            The zeroDAO Site may contain links to other websites ("Linked
            Sites"). The Linked Sites are not under the control of ZD and ZD is
            not responsible for the contents of any Linked Site, including
            without limitation any link contained in a Linked Site, or any
            changes or updates to a Linked Site. When you click on a link to a
            Linked Site, we may not warn you that you have left the zeroDAO Site
            and are subject to the terms and conditions (including privacy
            policies) of another website or destination. ZD is providing these
            links to you only as a convenience, and the inclusion of any link
            does not imply endorsement by ZD of the site or any association with
            its operators. You use the Linked Sites at your own risk. When you
            leave the zeroDAO Site, our Terms and policies no longer govern. You
            should review applicable terms and policies, including privacy and
            data gathering practices, of the Linked Sites, and should make
            whatever investigation you feel necessary or appropriate before
            proceeding with any transaction with any third party.
          </p>
          <p className="text-black snap-center">
            Certain services made available via the zeroDAO Site are delivered
            by third party sites and organizations.
          </p>
          <h1 className="text-lg text-black font-bold">
            Prohibited Uses and Intellectual Property
          </h1>
          <p className="text-black snap-center">
            You are granted a non-exclusive, non-transferable, revocable license
            to access and use zeroDAO Site strictly in accordance with these
            terms of use. As a condition of your use of the zeroDAO Site, you
            warrant to ZD that you will not use the zeroDAO Site for any purpose
            that is unlawful or prohibited by these Terms. Among other things,
            you acknowledge that your use of the zeroDAO protocol, and any other
            distributed ledger technology, may implicate financial regulations
            in various jurisdictions, and that you bear the sole responsibility
            for determining the laws that apply to your instance or use case,
            and that you are complying with applicable laws and regulations. You
            further acknowledge that the law regarding financial and distributed
            ledger technology, and blockchain and cryptocurrencies is uncertain
            and undeveloped, and is subject to unexpected changes and regulatory
            enforcement. You may not use the zeroDAO Site in any manner that
            could damage, disable, overburden, or impair the zeroDAO Site or
            interfere with any other party's use and enjoyment of the zeroDAO
            Site. You may not obtain or attempt to obtain any materials or
            information through any means not intentionally made available or
            provided for through the zeroDAO Site.
          </p>
          <p className="text-black snap-center">
            All content included on the zeroDAO Site, such as text, graphics,
            logos, images, as well as the compilation thereof, and any software
            used on the zeroDAO Site, is the property of ZD or its suppliers and
            protected by copyright, Trademark and other laws that protect
            intellectual property and proprietary rights. You agree to observe
            and abide by all copyright and other proprietary notices, legends or
            other restrictions contained in any such content and will not make
            any changes thereto.
          </p>
          <p className="text-black snap-center">
            {" "}
            You will not modify, publish, transmit, reverse engineer,
            participate in the transfer or sale, create derivative works, or in
            any way exploit any of the content, in whole or in part, found on
            the zeroDAO Site. ZD content is not for resale. Your use of the
            zeroDAO Site does not entitle you to make any unauthorized use of
            any protected content, and in particular you will not delete or
            alter any proprietary rights or attribution notices in any content.
            You will use protected content solely for your personal use, and
            will make no other use of the content without the express written
            permission of ZD and the copyright owner. You agree that you do not
            acquire any ownership rights in any protected content.
          </p>
          <p className="text-black snap-center">
            {" "}
            Unless otherwise indicated, all ZD content is the property of the ZD
            or third-party licensors and, subject to the terms and conditions of
            these Terms, is licensed to you under the terms of the MIT License.
            (currently available at:
            http://opensource.org/licenses/mit-license.php). By downloading or
            otherwise accessing such ZD content, you agree to comply with all
            the terms of the MIT license.
          </p>
          <h1 className="text-lg text-black font-bold">Materials</h1>
          <p className="text-black snap-center">
            ZD does not immediately claim ownership to any feedback or
            suggestions ("Feedback") you provide to ZD via the zeroDAO Site.
          </p>
          <h1 className="text-lg text-black font-bold">International Users</h1>
          <p className="text-black snap-center">
            ZD may be accessed from countries around the world and may contain
            references to Services and content that are not available in your
            country. The zeroDAO Site is controlled and offered by ZD from its
            facilities. ZD makes no representations that the zeroDAO Site is
            appropriate or available for use in other locations. Those who
            access or use the Services or content from other countries do so at
            their own volition and are responsible for compliance with local
            law.
          </p>
          <h1 className="text-lg text-black font-bold">Indemnification</h1>
          <p className="text-black snap-center">
            {" "}
            You agree to indemnify, defend and hold harmless ZD, its officers,
            directors, employees, agents and third parties, for any losses,
            costs, liabilities and expenses (including reasonable attorneys'
            fees) relating to or arising out of your use of or inability to use
            the zeroDAO Site or services, any postings or submissions made by
            you or other users, your violation of any terms of this Agreement or
            your violation of any rights, including intellectual property
            rights, of a third party, or your violation of any applicable laws,
            rules or regulations. ZD reserves the right, at its own cost, to
            assume the exclusive defense and control of any matter otherwise
            subject to indemnification by you, in which event you will fully
            cooperate with ZD in asserting any available defenses.
          </p>
          <h1 className="text-lg text-black font-bold">
            Disclaimer of Certain Liabilities
          </h1>
          <p className="text-black snap-center font-bold">
            THE INFORMATION, SOFTWARE, PRODUCTS, AND SERVICES INCLUDED IN OR
            AVAILABLE THROUGH THE ZERODAO SITE MAY INCLUDE INACCURACIES OR
            TYPOGRAPHICAL ERRORS. CHANGES ARE PERIODICALLY ADDED TO THE
            INFORMATION HEREIN. ZD AND/OR ITS SUPPLIERS MAY MAKE IMPROVEMENTS
            AND/OR CHANGES IN THE ZERODAO SITE AT ANY TIME.
          </p>
          <p className="text-black snap-center font-bold">
            ZD AND/OR ITS SUPPLIERS MAKE NO REPRESENTATIONS ABOUT THE
            SUITABILITY, RELIABILITY, AVAILABILITY, TIMELINESS, AND ACCURACY OF
            THE INFORMATION, SOFTWARE, PRODUCTS, SERVICES AND RELATED GRAPHICS
            CONTAINED ON THE ZERODAO SITE FOR ANY PURPOSE. TO THE MAXIMUM EXTENT
            PERMITTED BY APPLICABLE LAW, ALL SUCH INFORMATION, SOFTWARE,
            PRODUCTS, SERVICES AND RELATED GRAPHICS ARE PROVIDED "AS IS" WITHOUT
            WARRANTY OR CONDITION OF ANY KIND. ZD AND/OR ITS SUPPLIERS HEREBY
            DISCLAIM ALL WARRANTIES AND CONDITIONS WITH REGARD TO THIS
            INFORMATION, SOFTWARE, PRODUCTS, SERVICES AND RELATED GRAPHICS,
            INCLUDING ALL IMPLIED WARRANTIES OR CONDITIONS OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE, TITLE, ACCURACY, SECURITY, USAGE,
            WORKMANSHIP AS TO TECHNICAL CODING, ABSENCE OF DEFECTS, AND
            NON-INFRINGEMENT.
          </p>
          <p className="text-black snap-center font-bold">
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL
            ZD AND/OR ITS SUPPLIERS BE LIABLE FOR ANY DIRECT, INDIRECT,
            PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL DAMAGES OR ANY DAMAGES
            WHATSOEVER INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF USE,
            DATA OR PROFITS, ARISING OUT OF OR IN ANY WAY CONNECTED WITH THE USE
            OR PERFORMANCE OF THE ZERODAO SITE, WITH THE DELAY OR INABILITY TO
            USE THE ZERODAO SITE OR RELATED SERVICES, THE PROVISION OF OR
            FAILURE TO PROVIDE SERVICES, OR FOR ANY INFORMATION, SOFTWARE,
            PRODUCTS, SERVICES AND RELATED GRAPHICS OBTAINED THROUGH THE ZERODAO
            SITE, OR OTHERWISE ARISING OUT OF THE USE OF THE ZERODAO SITE,
            WHETHER BASED ON CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY OR
            OTHERWISE, EVEN IF ZD OR ANY OF ITS SUPPLIERS HAS BEEN ADVISED OF
            THE POSSIBILITY OF DAMAGES. BECAUSE SOME STATES/JURISDICTIONS DO NOT
            ALLOW THE EXCLUSION OR LIMITATION OF LIABILITY FOR CONSEQUENTIAL OR
            INCIDENTAL DAMAGES, THE ABOVE LIMITATION MAY NOT APPLY TO YOU. IF
            YOU ARE DISSATISFIED WITH ANY PORTION OF THE ZERODAO SITE, YOUR SOLE
            AND EXCLUSIVE REMEDY IS TO DISCONTINUE USING THE ZERODAO SITE.
          </p>
          <p className="text-black snap-center font-bold">
            TO THE FULLEST EXTENT PERMITTED BY LAW AND NOTWITHSTANDING ANY OTHER
            PROVISION OF THIS AGREEMENT OR ANY OTHER AGREEMENT CONTEMPLATED
            HEREIN OR APPLICABLE PROVISIONS OF LAW OR EQUITY OR OTHERWISE, THE
            PARTIES HERETO HEREBY AGREE TO ELIMINATE ANY AND ALL FIDUCIARY
            DUTIES THE ZD AND/OR ZERODAO VOLUNTEERS OR ANY RELATED ENTITIES AND
            AGENTS MAY HAVE TO YOU, OR YOUR AGENTS, AND AFFILIATES, OR THE END
            USERS OF THE SERVICE, THE SITE OR ITS CONTENT, PROVIDED THAT SUCH
            EXCLUSION OR LIMITATION OF LIABILITY SHALL NOT EXTEND TO
            MISAPPROPRIATION OF YOUR ASSETS OR FUNDS, SITE OR CONTENT PROVIDED
            BY THE ZD AND/OR ZERODAO VOLUNTEERS OR ANY RELATED ENTITIES AND
            AGENTS OR OTHER ACTS OR OMISSIONS THAT CONSTITUTE A BAD FAITH
            VIOLATION OF THE IMPLIED CONTRACTUAL COVENANT OF GOOD FAITH AND FAIR
            DEALING.
          </p>
          <h1 className="text-lg text-black font-bold">
            Termination/Access Restriction
          </h1>
          <p className="text-black snap-center">
            ZD reserves the right, in its sole discretion, to terminate your
            access to the zeroDAO Site and its related services or any portion
            thereof at any time, without notice. This agreement is governed by
            the laws of Wyoming.
          </p>
          <p className="text-black snap-center">
            You agree that no joint venture, partnership, employment, or agency
            relationship exists between you and ZD as a result of this agreement
            or use of the zeroDAO Site. ZD's performance of this agreement is
            subject to existing laws and legal process, and nothing contained in
            this agreement is in derogation of ZD's right to comply with
            governmental, court and law enforcement requests or requirements
            relating to your use of the zeroDAO Site or information provided to
            or gathered by ZD with respect to such use. If any part of this
            agreement is determined to be invalid or unenforceable pursuant to
            applicable law including, but not limited to, the warranty
            disclaimers and liability limitations set forth above, then the
            invalid or unenforceable provision will be deemed superseded by a
            valid, enforceable provision that most closely matches the intent of
            the original provision and the remainder of the agreement shall
            continue in effect.
          </p>
          <p className="text-black snap-center">
            Unless otherwise specified herein, this agreement constitutes the
            entire agreement between the user and ZD with respect to the zeroDAO
            Site and it supersedes all prior or contemporaneous communications
            and proposals, whether electronic, oral or written, between the user
            and ZD with respect to the zeroDAO Site. A printed version of this
            agreement and of any notice given in electronic form shall be
            admissible in judicial or administrative proceedings based upon or
            relating to this agreement to the same extent and subject to the
            same conditions as other business documents and records originally
            generated and maintained in printed form. It is the express wish to
            the parties that this agreement and all related documents be written
            in English.
          </p>
          <h1 className="text-lg text-black font-bold"> Dispute Resolution </h1>
          <p className="text-black snap-center">
            Please read the following arbitration agreement in this Section
            ("Arbitration Agreement") carefully. It requires you to arbitrate
            disputes with ZD and limits the manner in which you can seek relief
            from us.
          </p>
          <h1 className="text-lg text-black font-bold">
            Applicability of Arbitration Agreement
          </h1>
          <p className="text-black snap-center">
            You agree that any dispute or claim relating in any way to your
            access or use of the zeroDAO Site, to any products sold or
            distributed through the zeroDAO Site, or to any aspect of your
            relationship with ZD, will be resolved by binding arbitration,
            rather than in court, except that (1) you may assert claims in small
            claims court if your claims qualify; and (2) you or ZD may seek
            equitable relief in court for infringement or other misuse of
            intellectual property rights (such as trademarks, trade dress,
            domain names, trade secrets, copyrights, and patents). This
            Arbitration Agreement shall apply, without limitation, to all claims
            that arose or were asserted before the Effective Date of this
            Agreement or any prior version of this Agreement.
          </p>
          <h1 className="text-lg text-black font-bold">
            Arbitration Rules and Forum
          </h1>
          <p className="text-black snap-center">
            The Federal Arbitration Act governs the interpretation and
            enforcement of this Arbitration Agreement. To begin an arbitration
            proceeding, you must send a letter requesting arbitration and
            describing your claim to our registered agent [include name and
            address of registered agent here]. The arbitration will be conducted
            by JAMS, an established alternative dispute resolution provider.
            Disputes involving claims and counterclaims under $250,000, not
            inclusive of attorneys' fees and interest, shall be subject to
            JAMS's most current version of the Streamlined Arbitration Rules and
            procedures available at
            http://www.jamsadr.com/rules-streamlined-arbitration/; all other
            claims shall be subject to JAMS's most current version of the
            Comprehensive Arbitration Rules and Procedures, available at
            http://www.jamsadr.com/rules-comprehensive-arbitration/. JAMS's
            rules are also available at www.jamsadr.com or by calling JAMS at
            800-352-5267. If JAMS is not available to arbitrate, the parties
            will select an alternative arbitral forum. If the arbitrator finds
            that you cannot afford to pay JAMS's filing, administrative, hearing
            and/or other fees and cannot obtain a waiver from JAMS, ZD will pay
            them for you. In addition, ZD will reimburse all such JAMS's filing,
            administrative, hearing and/or other fees for claims totaling less
            than $10,000 unless the arbitrator determines the claims are
            frivolous.
          </p>
          <p className="text-black snap-center">
            You may choose to have the arbitration conducted by telephone, based
            on written submissions, or in person in the country where you live
            or at another mutually agreed location. Any judgment on the award
            rendered by the arbitrator may be entered in any court of competent
            jurisdiction.
          </p>
          <h1 className="text-lg text-black font-bold">
            Authority of Arbitrator
          </h1>
          <p className="text-black snap-center">
            {" "}
            The arbitrator shall have exclusive authority to (a) determine the
            scope and enforceability of this Arbitration Agreement and (b)
            resolve any dispute related to the interpretation, applicability,
            enforceability or formation of this Arbitration Agreement including,
            but not limited to any claim that all or any part of this
            Arbitration Agreement is void or voidable. The arbitration will
            decide the rights and liabilities, if any, of you and ZD. The
            arbitration proceeding will not be consolidated with any other
            matters or joined with any other cases or parties. The arbitrator
            shall have the authority to grant motions dispositive of all or part
            of any claim. The arbitrator shall have the authority to award
            monetary damages and to grant any non-monetary remedy or relief
            available to an individual under applicable law, the arbitral
            forum's rules, and the Agreement (including the Arbitration
            Agreement). The arbitrator shall issue a written award and statement
            of decision describing the essential findings and conclusions on
            which the award is based, including the calculation of any damages
            awarded. The arbitrator has the same authority to award relief on an
            individual basis that a judge in a court of law would have. The
            award of the arbitrator is final and binding upon you and us.
          </p>
          <h1 className="text-lg text-black font-bold">Waiver of Jury Trial</h1>
          <p className="text-black snap-center">
            <span className="font-bold">
              YOU AND COMPANY HEREBY WAIVE ANY CONSTITUTIONAL AND STATUTORY
              RIGHTS TO SUE IN COURT AND HAVE A TRIAL IN FRONT OF A JUDGE OR A
              JURY.
            </span>{" "}
            You and ZD are instead electing that all claims and disputes shall
            be resolved by arbitration under this Arbitration Agreement, except
            as specified in Applicability or Arbitration Agreement section
            above. An arbitrator can award on an individual basis the same
            damages and relief as a court and must follow this Agreement as a
            court would. However, there is no judge or jury in arbitration, and
            court review of an arbitration award is subject to very limited
            review.
          </p>
          <h1 className="text-lg text-black font-bold">
            Waiver of Class or Other Non-Individualized Relief
          </h1>
          <p className="text-black snap-center">
            <span className="font-bold">
              ALL CLAIMS AND DISPUTES WITHIN THE SCOPE OF THIS ARBITRATION
              AGREEMENT MUST BE ARBITRATED ON AN INDIVIDUAL BASIS AND NOT ON A
              CLASS OR COLLECTIVE BASIS, ONLY INDIVIDUAL RELIEF IS AVAILABLE,
              AND CLAIMS OF MORE THAN ONE CUSTOMER OR USER CANNOT BE ARBITRATED
              OR CONSOLIDATED WITH THOSE OF ANY OTHER CUSTOMER OR USER.{" "}
            </span>{" "}
            If a decision is issued stating that applicable law precludes
            enforcement of any of this subsection's limitations as to a given
            claim for relief, than then claim must be severed from the
            arbitration and brought into the State or Federal Courts located in
            Wyoming.
          </p>
          <p className="text-black snap-center">
            All other claims shall be arbitrated.
          </p>
          <h1 className="text-lg text-black font-bold">
            30-Day Right to Opt Out
          </h1>
          <p className="text-black snap-center">
            You have the right to opt out of the provisions of this Arbitration
            Agreement by sending written notice of your decision to opt out to
            the following address: Z DAO LLC, 312 W. 2nd St #2108 Casper, WY
            82601, within 30 days after first becoming subject to this
            Arbitration Agreement through your use of the zeroDAO site or any
            aspect of the Service. Your notice must include your name and
            address, your zeroDAO username (if any), the email address you used
            to set up your zeroDAO account (if you have one), and an unequivocal
            statement that you want to opt out of this Arbitration Agreement. If
            you opt out of this Arbitration Agreement, all other parts of this
            Agreement will continue to apply to you. Opting out of this
            Arbitration Agreement has no effect on any other arbitration
            agreements that you may currently have, or may enter in the future,
            with us.
          </p>
          <h1 className="text-lg text-black font-bold">Severability</h1>
          <p className="text-black snap-center">
            Except as provided in the Waiver of Class or Other
            Non-Individualized Relief subsection, if any part or parts of this
            Arbitration Agreement are found under the law to be invalid or
            unenforceable, then such specific part or parts shall be of no force
            and effect and shall be severed and the remainder of the Arbitration
            Agreement shall continue in full force and effect.
          </p>
          <h1 className="text-lg text-black font-bold">
            Survival of Agreement
          </h1>
          <p className="text-black snap-center">
            This Arbitration Agreement will survive the termination of your
            relationship with ZD.
          </p>
          <h1 className="font-bold text-black text-lg">Modification</h1>
          <p className="text-black snap-center">
            Notwithstanding any provision in this Agreement to the contrary, you
            agree that if ZD makes any future material change to this
            Arbitration Agreement, you may reject that change within thirty (30)
            days of such change becoming effective by writing ZD at the
            following address: Z DAO LLC, 312 W. 2nd St #2108 Casper, WY 82601.
            You waive any right you may have to receive specific notice of such
            changes or modifications. Use of the Service by you after any
            modification to the Agreement constitutes your acceptance of the
            Agreement as modified.
          </p>
          <h1 className="font-bold text-black text-lg">Assignment</h1>
          <p className="text-black snap-center">
            The Terms, and your rights and obligations hereunder, may not be
            assigned, subcontracted, delegated or otherwise transferred by you
            without ZD’s prior written consent, and any attempted assignment,
            subcontract, delegation, or transfer in violation of the foregoing
            will be null and void.
          </p>
          <h1 className="font-bold text-black text-lg">
            No Third Party Beneficiaries
          </h1>
          <p className="text-black snap-center">
            You agree that other than as explicitly provided herein, there are
            no third-party beneficiaries of this Agreement.
          </p>
          <h1 className="font-bold-text-lg text-black">Contact Us</h1>
          <p className="text-black snap-center">
            ZD welcomes your questions or comments regarding the Terms via email
            at support@zdao.group.
          </p>
        </div>
        <div className="flex flex-col items-center w-10/12 ">
          <div className="container w-10/12 pb-2">
            <PrimaryRoundedButton
              active={read}
              action={sign}
              label={read ? "Acknowledge" : "Scroll To Read"}
            />
          </div>
          <div className="text-sm text-black italic text-center">
            By selecting acknowledge you are confirming that you have READ and
            ACCEPT the terms and conditions
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
