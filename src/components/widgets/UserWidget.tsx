import { User } from "../../schemas/user.schema"

type Props = {
    user: User
}

export const UserWidget = ({ user }: Props) => {
    return <div className="flex items-center gap-3">
        <div className="bg-gray-900 size-6 rounded-full text-white flex justify-center items-center text-xs">{user.name.slice(0, 1)}</div>
        <p className="text-sm">{`${user.name} ${user.lastname}`}</p>
    </div>
}