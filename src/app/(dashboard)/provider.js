
import { SpinnerDiamond } from 'spinners-react'

import { getServerSession } from "next-auth";
import { options } from '../api/auth/[...nextauth]/options';
import { redirect } from "next/navigation";

export const DashAuthProvider = async ({ children }) => {


  const session = await getServerSession(options)
  
  return session ? {children} :  <div className={styles.loader}>
  <SpinnerDiamond size={100} thickness={100} speed={100} color="rgba(255, 255, 255, 1)" secondaryColor="rgba(74, 172, 57, 1)" />
</div>
};