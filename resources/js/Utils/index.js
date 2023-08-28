import moment from 'moment'

export const route = window.route

export function checkPermission(auth_user, permissions_id) {
    const find_permissions = permissions_id.map((permission_id) => {
        return auth_user?.can.find((element) => element == permission_id) == permission_id
    })

    return find_permissions.find((element) => element == true) == true
}

export function checkPermissionByUser(auth_user, permissions_id) {
    const find_permissions = permissions_id.map((permission_id) => {
        return auth_user?.can_by_user.find((element) => element == permission_id) == permission_id
    })

    return find_permissions?.find((element) => element == true) == true
}

export function checkRole(auth_user, roles_id) {
    const find_roles = roles_id?.map((role_id) => {
        return (
            auth_user?.roles.filter(function (role) {
                return role.id == role_id
            }).length > 0
        )
    })

    return find_roles?.find((element) => element == true) == true
}

export function monthDiff(d1, d2) {
    let month_difference = 0
    month_difference = moment(new Date(d2)).diff(new Date(d1), 'months', true)

    return month_difference.toFixed(1)
}

export function back() {
    window.history.back()
}
