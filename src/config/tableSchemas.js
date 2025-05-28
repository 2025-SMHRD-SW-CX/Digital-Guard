export const videoSchema = {
  idKey:     'id',
  linkKey:   'link',
  statusKey: 'status',
  statusOptions: ['공개','비공개'],
  columns: [
    { key:'id',        headerName:'번호',        width:80,    editable:false },
    { key:'title',     headerName:'제목',        flex:2,     editable:true  },
    { key:'category',  headerName:'카테고리',    flex:1,     editable:true  },
    { key:'link',      headerName:'링크',        flex:1,     editable:true },
    { key:'createdAt', headerName:'등록일',      width:120,  editable:false },
    { key:'status',    headerName:'상태',        width:100,  editable:true },
    { key:'actions',   headerName:'작업',        width:180,  editable:false },
  ]
};

export const quizSchema = {
  idKey:     'id',
  statusKey: 'status',
  statusOptions: ['활성','비활성'],
  columns: [
    { key:'id',        headerName:'번호',     width:80,   editable:false },
    { key:'question',  headerName:'문제',     flex:2,    editable:true  },
    { key:'optionsText', headerName:'선택지',  flex:2,    editable:true  },
    { key:'answer',    headerName:'정답',     width:100, editable:true  },
    { key:'createdAt', headerName:'등록일',   width:120, editable:false },
    { key:'status',    headerName:'상태',     width:100, editable:true  },
    { key:'actions',   headerName:'작업',     width:180, editable:false },
  ]
};