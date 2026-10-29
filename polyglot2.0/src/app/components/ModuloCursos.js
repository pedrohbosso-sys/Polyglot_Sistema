'use client';
import { useEffect, useMemo, useState } from 'react';
const empty = { nome:'', idioma:'Inglês', nivel:'A1', cargaHoraria:60, descricao:'' };
export default function ModuloCursos({ podeEditar }) {
 const [rows,setRows]=useState([]),[form,setForm]=useState(empty),[editId,setEditId]=useState(null),[show,setShow]=useState(false),[query,setQuery]=useState(''),[message,setMessage]=useState(''),[error,setError]=useState(false),[busy,setBusy]=useState(false);
 async function load(){const r=await fetch('/api/cursos');const d=await r.json();if(r.ok)setRows(d.cursos||[]);else{setMessage(d.mensagem||'Erro ao carregar cursos.');setError(true)}}
 useEffect(()=>{load()},[]);
 const filtered=useMemo(()=>rows.filter(r=>`${r.nome} ${r.idioma} ${r.nivel}`.toLowerCase().includes(query.toLowerCase())),[rows,query]);
 function novo(){setForm(empty);setEditId(null);setShow(true);setMessage('');setError(false)}
 function editar(r){setForm({nome:r.nome,idioma:r.idioma,nivel:r.nivel,cargaHoraria:r.cargaHoraria,descricao:r.descricao||''});setEditId(r._id);setShow(true);setMessage('')}
 async function salvar(e){e.preventDefault();setBusy(true);const r=await fetch(editId?`/api/cursos/${editId}`:'/api/cursos',{method:editId?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,cargaHoraria:Number(form.cargaHoraria)})});const d=await r.json();setBusy(false);setMessage(d.mensagem||'Operação concluída.');setError(!r.ok);if(r.ok){setShow(false);setForm(empty);setEditId(null);await load()}}
 async function excluir(r){if(!confirm(`Excluir o curso "${r.nome}"?`))return;const res=await fetch(`/api/cursos/${r._id}`,{method:'DELETE'});const d=await res.json();setMessage(d.mensagem||'Operação concluída.');setError(!res.ok);if(res.ok)await load()}
 return <>
  <div className="section-head"><h2>Catálogo de cursos <span className="muted">({rows.length})</span></h2>{podeEditar&&<button className="btn btn-primary" onClick={novo}>＋ Novo curso</button>}</div>
  {message&&<div className={`message ${error?'error':''}`}>{message}</div>}
  {show&&podeEditar&&<form className="form-card" onSubmit={salvar} style={{marginBottom:22}}><div className="section-head" style={{marginTop:0}}><h2>{editId?'Editar curso':'Cadastrar curso'}</h2><button type="button" className="btn btn-secondary" onClick={()=>setShow(false)}>Fechar</button></div>
   <div className="form-grid">
    <div className="field"><label>Nome do curso *</label><input className="input" required minLength="2" maxLength="100" value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})}/></div>
    <div className="field"><label>Idioma *</label><select className="input" value={form.idioma} onChange={e=>setForm({...form,idioma:e.target.value})}>{['Inglês','Espanhol','Francês','Alemão','Italiano','Japonês','Mandarim','Português'].map(x=><option key={x}>{x}</option>)}</select></div>
    <div className="field"><label>Nível *</label><select className="input" value={form.nivel} onChange={e=>setForm({...form,nivel:e.target.value})}>{['A1','A2','B1','B2','C1','C2'].map(x=><option key={x}>{x}</option>)}</select></div>
    <div className="field"><label>Carga horária (horas) *</label><input className="input" type="number" min="1" max="5000" required value={form.cargaHoraria} onChange={e=>setForm({...form,cargaHoraria:e.target.value})}/></div>
    <div className="field full"><label>Descrição</label><textarea className="input" rows="3" maxLength="500" value={form.descricao} onChange={e=>setForm({...form,descricao:e.target.value})}/></div>
   </div><div className="form-actions"><button type="button" className="btn btn-secondary" onClick={()=>setShow(false)}>Cancelar</button><button className="btn btn-primary" disabled={busy}>{busy?'Salvando...':'Salvar curso'}</button></div>
  </form>}
  <div className="toolbar"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Pesquisar por curso, idioma ou nível..."/><button className="btn btn-secondary" onClick={load}>↻ Atualizar</button></div>
  <div className="table-wrap"><table className="data-table"><thead><tr><th>Curso</th><th>Idioma</th><th>Nível</th><th>Carga horária</th><th>Descrição</th>{podeEditar&&<th>Ações</th>}</tr></thead><tbody>
  {filtered.map(r=><tr key={r._id}><td><strong>{r.nome}</strong></td><td>{r.idioma}</td><td><span className="badge">{r.nivel}</span></td><td>{r.cargaHoraria}h</td><td>{r.descricao||'—'}</td>{podeEditar&&<td><div className="actions"><button className="btn btn-secondary btn-small" onClick={()=>editar(r)}>Editar</button><button className="btn btn-danger btn-small" onClick={()=>excluir(r)}>Excluir</button></div></td>}</tr>)}
  {!filtered.length&&<tr><td colSpan={podeEditar?6:5}><div className="empty"><strong>Nenhum curso encontrado</strong>Use “Novo curso” para cadastrar o primeiro.</div></td></tr>}
  </tbody></table></div>
 </>;
}
