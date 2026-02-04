import { signOutFunc } from "@/actions/signOut";

export function LogOut() {
  return (
    <button
      type='button'
      onClick={signOutFunc}
      className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-orange-400 hover:text-white transition-color duration-400 shadow-sm hover:shadow">
      Log out
    </button>
  )
}