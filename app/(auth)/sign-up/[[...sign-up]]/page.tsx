import { SignIn } from "@clerk/nextjs";
 
export default function Page() {
  return(
    <>
    <h6>Hello World this is the Sign In Page</h6>
   <SignIn />
    </>
  );
}