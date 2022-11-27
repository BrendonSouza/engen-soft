const router = require("express").Router();
const bcrypt = require("bcrypt");
const session = require('../utils/session_config');
const authMiddleware = require('../utils/middleware/authMiddleware');
const env = require("dotenv").config();
var db = require('../utils/db_config');

router.get('/login', (req, res) => {
    res.render("login.ejs", { options: {} });
})

const tipoCrud = {
    "inserir": "C",
    "visualizar": "R",
    "atualizar": "U",
    "deletar": "D"
}

router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    db.query("SELECT * FROM users WHERE username = $1", [username], async (err, result) => {

        if (err)
            throw err;

        if (result.rows.length > 0) {
            const { id, email } = result.rows[0];
            const isValid = await bcrypt.compare(password, result.rows[0].password)
            if (isValid) {
                req.session.user = { id, username, email };
                console.log("Logged in");
                res.redirect('/cadastro-requisito');
                // res.redirect('/visualiza-reqfunc')
            }
            else {
                res.render("login.ejs", { options: { error: "Senha incorreta" } });
            }
        }
        else {
            res.render("login.ejs", { options: { error: "Usuário não encontrado" } });
        }


    });
});

router.get('/register', (req, res) => {
    res.render("register.ejs", { options: {} });
})

router.post('/register', async (req, res) => {
    //TODO incluir validação de nome repetido
    let { username, senha, email } = req.body;
    senha = await bcrypt.hash(senha, 10);
    const sql = `INSERT INTO users (username, password, email) VALUES ('${username}', '${senha}', '${email}')  RETURNING id`
   
    db.query(sql, (err, result) => {
        
        if (err){
            return res.render("register.ejs", { options: { error: "Username já existe" } });
        }
        res.redirect("/login");
    })
})


router.use(authMiddleware);
//rotas protegidas

router.get('/incluir-projeto', (req, res) => {
    res.render("inserir-projeto.ejs", { options: {} });
})

router.get('/cadastro-requisito', (req, res) => {
    //recupera os projetos do usuário
    const sql = `SELECT * FROM projeto WHERE id_users = ${req.session.user.id}`
    db.query(sql, (err, result) => {
        if (err||result.rowCount == 0){
            return res.redirect('/incluir-projeto');
        }
        res.render("cadastro-requisito.ejs", { options: { filecss: "styles/requisitos.css", projects: result.rows } });
    })
    // res.render("cadastro-requisito.ejs", { options: { filecss: "styles/requisitos.css" } });
})

router.post('/cadastro-requisito', async (req, res) => {
    const { crud, entidade, atributos, projeto } = req.body;
    const { pre, um, com } = { pre: "O sistema deve", um: "um(a)", com: "com" }
    const descricao = `${pre} ${crud} ${um} ${entidade.toLowerCase()} ${com} ${atributos.toLowerCase()}`;
    const sql = `INSERT INTO requisitos_de_usuario (descritivo, id_projeto) VALUES ('${descricao}', ${projeto}) RETURNING id`
    const idRequsitoUsuario = (await db.query(sql)).rows[0].id;

    const nomeReq = "RF0" + idRequsitoUsuario;

    const sql2 = `INSERT INTO requisitos_funcionais (id_requisitos_de_usuario, nome) VALUES (${idRequsitoUsuario},'${nomeReq}') RETURNING id`
    const idRequsitoFuncional = (await db.query(sql2)).rows[0].id;

    const sql3 = ` INSERT INTO requisitos_de_crud (tipo, id_requisitos_funcionais) VALUES ('${crud}', ${idRequsitoFuncional}) RETURNING id`
    const idRequisitoCrud = (await db.query(sql3)).rows[0].id;

    const sql4 = ` INSERT INTO entidades (nome,id_requisitos_de_crud ) VALUES ('${entidade.toLowerCase()}', ${idRequisitoCrud}) RETURNING id`
    const idEntidade = (await db.query(sql4)).rows[0].id;

    // //separa atributos por virgula
    const atributosArray = atributos.toLowerCase().split(",");
    atributosArray.forEach((atributo) => {
        const sql5 = ` INSERT INTO atributos (nome, id_entidades) VALUES ('${atributo}', ${idEntidade})`
        db.query(sql5, (err, result) => {
            if (err) throw err;

        })
    })
    res.redirect("/cadastro-requisito");

})

router.post('/incluir-projeto', async (req, res) => {

    //TODO Incluir validação de nome repetido
    const { nome, descricao } = req.body;
    const user_id = req.session.user.id;

    const sql = `INSERT INTO projeto (nome, descricao,id_users) VALUES ('${nome}', '${descricao}',${user_id}) RETURNING id`
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect("/cadastro-requisito");
    })
})

router.get('/visualiza-reqfunc',async(req,res)=>{
    const projetos = await listProjects(req.session.user.id);

 

    // requisitos:objetos
    res.render('visualizar-req-func.ejs',{options:{ projects:projetos, codReq:0}});
})

router.post('/visualiza-req-func',async(req,res)=>{
    const projetos = await listProjects(req.session.user.id);
    const project_id = req.body.projeto;
    const sql = `SELECT requisitos_funcionais.nome, requisitos_funcionais.id FROM requisitos_funcionais inner join requisitos_de_usuario on requisitos_funcionais.id_requisitos_de_usuario = requisitos_de_usuario.id inner join projeto on requisitos_de_usuario.id_projeto = projeto.id where projeto.id = ${req.body.projeto}`
    const requisitos = (await db.query(sql)).rows;
    const objetos =[];
    await Promise.all(
        requisitos.map(async(requisito)=>{
            console.log(requisito)
            const obj ={}
            obj.id = requisito.id;
            const nome = requisito.nome;
            obj.numReq = nome;
            // select * from requisitos_de_crud rdc inner join entidades e on rdc.id = e.id_requisitos_de_crud;
            const sql2 = `SELECT * FROM requisitos_de_crud rdc inner join entidades e on rdc.id = e.id_requisitos_de_crud where rdc.id_requisitos_funcionais = ${requisito.id}`
            const crud = (await db.query(sql2)).rows;
    
                crud.map(async(crud)=>{
                    if(crud.tipo == "atualizar"){
                        obj.getSet = "get/set";
                        obj.tipo = "U"
                    }
                    else if(crud.tipo == "excluir"){
                        obj.getSet = "get/set";
                        obj.tipo = "D"
                    }
                    else if(crud.tipo == "listar"){
                        obj.getSet = "get";
                        obj.tipo = "R";
                    }
                    else{
                        obj.getSet = "set";
                        obj.tipo = "C";
                    }
                    
                    obj.nome = crud.tipo +" "+ crud.nome;
                    obj.entidade = crud.nome;
                })
                const sql3 = `SELECT * FROM condicoes_teste  ct inner join requisitos_funcionais rf on ct.id_requisitos_funcionais1 = rf.id where id_requisitos_funcionais = ${obj.id}`
                const condicoes = (await db.query(sql3)).rows;
                if(condicoes.length > 0){
                    obj.condicoes = condicoes;
                }
                else{
                    obj.condicoes = [{condicao:"*"}];
                }
               
           objetos.push(obj);
        })
    )
    res.render('visualizar-req-func.ejs',{options:{requisitos:objetos, projects:projetos,  selected:project_id, codReq:1}});
})

router.get('/associar/:id',async(req,res)=>{
    const id = req.params.id;
    const sql = `SELECT * FROM requisitos_funcionais rf inner join requisitos_de_usuario ru on rf.id_requisitos_de_usuario = ru.id where rf.id = ${id}`
    const requisito = (await db.query(sql)).rows[0];
    const sql2 = `SELECT * FROM requisitos_funcionais rf inner join requisitos_de_usuario ru on rf.id_requisitos_de_usuario = ru.id where rf.id != ${id}`
    const requisitos = (await db.query(sql2)).rows;
    res.render('associar-requisito.ejs',{options:{filecss:"styles/requisitos.css", requisito,requisitos,id}});
})

router.post('/associar',async(req,res)=>{
    const {condicoes,requisito,requisitoa} = req.body;
    const sql = `INSERT into condicoes_teste (id_requisitos_funcionais, id_requisitos_funcionais1, condicao) VALUES (${requisitoa},${requisito},'${condicoes}')`
    db.query(sql,(err,result)=>{
        if(err) throw err;
        res.redirect('/visualiza-reqfunc');
    })
})





router.get('/analise-de-riscos',async(req,res)=>{
    // console options redirect
    const projetos = await listProjects(req.session.user.id);
    res.render("analise-riscos.ejs", { options: {filecss:"styles/analise-riscos.css",projects: projetos} });
})

async function listProjects(user_id){
    const sql = `SELECT * FROM projeto where id_users = ${user_id}`
    const result = await db.query(sql);
    return result.rows;

}

router.post('/analise-de-riscos' ,async(req,res)=>{
    if(req.body.projeto){
        const project_id = req.body.projeto;
        const projetos = await listProjects(req.session.user.id);
        const sql = `SELECT * FROM itens_de_analise_de_riscos where id_projeto = ${project_id}`
        db.query(sql, (err, result) => {
            if (err) throw err;
            res.render("analise-riscos.ejs", { options: {filecss:"styles/analise-riscos.css" ,itens: result.rows, projects: projetos, selected:project_id} });
        })
    }
    else{
        const body = req.body;
        const arr = req.body.id
        const arrResponse = req.body.resposta
        //convert req.body.id to array of integers
        const arrIdInt = arr.map((id)=>parseInt(id));
        console.log(arrIdInt);
        for(let i = 0; i < arrIdInt.length; i++){
            const sql = `UPDATE itens_de_analise_de_riscos set resposta = '${arrResponse[i]}' where id = ${arrIdInt[i]}`
            await db.query(sql);
        }
        res.redirect('/analise-de-riscos');
    }
   

})



exports = module.exports = router;