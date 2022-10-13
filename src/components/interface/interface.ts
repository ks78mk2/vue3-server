export interface signin {
    admin_id: string,
    admin_pw: string
}

export interface tryCntUpdate {
    admin_id: string,
    login_trycnt : string,
    current_time : string
}

export interface adminInfo{
    admin_id: string,
    code_01: string,
    code_02: string,
    code_01_nm : string,
    code_02_nm : string,
    admin_lv : string
}

export interface viewChoice{
    dev_key: string,
    insert_date: string,
    cust_ctn: string,    
}

export interface getReportList{
    code_id : string | any,
    cust_nm : string | any,
    admin_id : string | any,
    sys_passfail : string | any,
    user_passfail : string | any,
    check_type : string | any
}
export interface getChannelList{
    ctl_nm: string | any,
    admin_id: string | any,
    admin_nm : string | any,
    code_01: string | any,
    code_02: string | any,
    code_id: string | any,
    offset: string
}
export interface getChannelCount{
    ctl_nm: string | any,
    admin_id: string | any,
    admin_nm : string | any,
    code_01: string | any,
    code_02: string | any,
    code_id: string | any
}
export interface getSubscriptionList{
    admin_id: string | any,
    code_01_nm: string | any,
    code_02_nm: string | any,
    offset: string
}

export interface getQNAList{
    start_date: string,
    end_date: string,
    identifier: string | any,
    name: string | any,
    mobile_num: string | any,
    company: string | any,
    offset: string
}
export interface getQNACount{
    start_date: string,
    end_date: string,
    identifier: string | any,
    name: string | any,
    mobile_num: string | any,
    company: string | any
}

export interface getSubscriptionCount{
    admin_id: string | any,
    code_01_nm: string | any,
    code_02_nm: string | any,
}

export interface getAdminInfo{
    code_01: string | any,
    code_02: string | any,
}
export interface getReportCount{
    start_date: string,
    end_date: string,
    code_id : string |any,
    cust_nm: string | any,
    student_num: string | any,
    code_01: string | any,
    code_02: string | any
}
export interface getAfterChannel{
    admin_id : string,
    start_time : string,
    test_duration : string
}
export interface getReportChannel{
    admin_id : string |any
}
export interface bookmarkInsert{
    p_insert_date: string,
    p_cust_ctn: string,
    admin_id: string,
    bookmark_pos: number,
    bookmark_type: number
}
export interface hideBookmark{
    p_insert_date: string,
    p_cust_ctn: string,
    admin_id: string,
    bookmark_pos: number,
    bookmark_type: number
}
export interface getBookmarkList{
    p_insert_date: string,
    p_cust_ctn: string,
    admin_id: string
}
export interface bookmarkIs{
    p_insert_date: string,
    p_cust_ctn: string,
    admin_id: string,
    bookmark_pos: number,
    bookmark_type: number
}