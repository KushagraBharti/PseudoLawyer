"use client";
import Image from "next/image";
import Navbar from "./components/Navbar";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    return (
        <>
            <Navbar />
            <div className="mt-10 mx-16 flex flex-col gap-4 text-white">
                <h1 className="text-6xl  barlow-black mb-4">
                    WELCOME TO PSEUDOLAWYER
                </h1>
                <h1 className="text-4xl barlow-black">ABOUT</h1>
                <h1 className="text-2xl barlow-regular">
                AI-Powered Contracting Made Simple <br></br>
                PseudoLawyer helps individuals and small businesses create, negotiate, and sign legal contracts—without the need for expensive lawyers. Using AI and AWS infrastructure, we make the legal process accessible, secure, and collaborative.
                From drafting NDAs to finalizing business agreements, our platform guides you every step of the way. With built-in negotiation tools, multilingual support, and secure digital signatures, PseudoLawyer empowers you to protect your interests with confidence.
                </h1>
                <h1 className="text-4xl barlow-black">HOW IT WORKS</h1>
                <h1 className="text-2xl barlow-regular">
                    Users begin by creating an account through our secure authentication system powered by AWS Cognito. <br />
                    To ensure legitimacy and compliance with legal standards, we integrate AWS Rekognition for real-time identity verification, confirming user age, capacity, and authority before any legal engagement begins.
                    <br /><br />
                    Once verified, users can initiate a contract by selecting from predefined templates—such as NDAs or business agreements—or by entering custom parameters. <br />
                    Our AI leverages a Retrieval Augmented Generation (RAG) architecture to generate contract drafts tailored to user input. <br />
                    Using LangChain and ChromaDB, the system dynamically pulls relevant legal content, ensuring the generated documents are accurate, context-aware, and jurisdiction-sensitive.
                    <br /><br />
                    Contracts are negotiated in real-time through a secure, built-in group chat. <br />
                    Every session is backed by AWS DynamoDB for efficient, scalable message storage. <br />
                    A fine-tuned language model, trained with legal negotiation data and deployed via AWS SageMaker with inferences served by AWS Bedrock, acts as an intelligent mediator—facilitating discussions, offering clause suggestions, and clarifying legal terms in plain language.
                    <br /><br />
                    To support accessibility and inclusivity, our platform integrates AWS Translate for multilingual communication and AWS Polly for converting text to speech. <br />
                    This allows users from diverse linguistic and literacy backgrounds to engage meaningfully with legal content.
                    <br /><br />
                    Once all parties agree, contracts can be securely signed using our digital signature module. <br />
                    Finalized documents, along with all chat history and audit logs, are encrypted and stored in AWS S3. <br />
                    We ensure every action is tracked and time-stamped, providing a tamper-proof trail that adds transparency and legal credibility to the entire contract lifecycle.
                </h1>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }} // Duration in seconds
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                        router.push("/api/auth/register");
                    }}
                    className="text-4xl mt-16 barlow-black mx-auto hover:bg-white hover:text-secondary px-4 py-1 rounded-full w-fit cursor-pointer"
                >
                    CLICK TO GET STARTED
                </motion.div>
                <div className="h-48"></div>
            </div>
        </>
    );
}
