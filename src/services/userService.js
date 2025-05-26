// src/services/userService.js
import { db } from './supabase'
import bcrypt from 'bcryptjs'

/**
 * 회원가입 - 유저 데이터 DB에 저장
 * @param {Object} user - 가입정보 { id, name, nickname, phone, birthday, email, password(plain) }
 * @returns {Promise<{data: any, error: any}>}
 */
export async function registerUser(user) {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(user.password, salt)

    // RPC 호출 (함수명, 파라미터명은 반드시 DB와 동일해야 함)
    const { data, error } = await db.rpc('register_user_with_progress', {
        _id: user.id,
        _name: user.name,
        _nickname: user.nickname,
        _phone: user.phone,
        _birthday: user.birthday,
        _email: user.email,
        _gender: user.gender,
        _password: hash,
    })

    return { data, error }
}


/**
 * 아이디 중복 체크
 * @param {string} id - 체크할 아이디
 * @returns {Promise<boolean>} - true: 사용 가능, false: 중복
 */
export async function checkUserIdDuplicate(id) {
  if (!id) return false
  const { data, error } = await db
    .from('user')
    .select('id')
    .eq('id', id)
    .single()
  // data가 없으면 사용 가능 (false), 있으면 중복 (true)
  return !data // true면 사용 가능, false면 중복!
}