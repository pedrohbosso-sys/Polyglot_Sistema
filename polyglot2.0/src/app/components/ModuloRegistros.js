'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

const configs = {
  professores: { title:'Professores', desc:'Gerencie os professores e seus dados de contato.', singular:'professor', icon:'♙', fields:[['nome','Nome completo','text',true],['email','E-mail','email',true],['telefone','Telefone','text',false],['observacoes','Especialidade / observações','textarea',false]], columns:[['nome','Nome'],['email','E-mail'],['telefone','Telefone']] },
  turmas: { title:'Turmas', desc:'Organize as turmas, os horários e os professores responsáveis.', singular:'turma', icon:'▦', fields:[['nome','Nome da turma','text',true],['cursoId','Curso','text',true],['professorId','Professor responsável','text',true],['horario','Dias e horário','text',true],['dataInicio','Data de início','date',false],['status','Situação','select',true,['Ativa','Planejada','Concluída']],['observacoes','Observações','textarea',false]], columns:[['nome','Turma'],['cursoId','Curso'],['professorId','Professor'],['horario','Horário'],['status','Situação']] },
  matriculas: { title:'Matrículas', desc:'Registre alunos em turmas e acompanhe a situação das matrículas.', singular:'matrícula', icon:'✚', fields:[['nome','Nome do aluno','text',true],['alunoId','ID do aluno (opcional)','text',false],['cursoId','Curso','text',true],['turmaId','Turma','text',true],['dataInicio','Data da matrícula','date',true],['status','Situação','select',true,['Ativa','Pendente','Cancelada']]], columns:[['nome','Aluno'],['cursoId','Curso'],['turmaId','Turma'],['dataInicio','Data'],['status','Situação']] },
  'notas-faltas': { title:'Notas e faltas', desc:'Registre o desempenho acadêmico e a frequência dos alunos.', singular:'registro acadêmico', icon:'✓', fields:[['nome','Nome do aluno','text',true],['alunoId','ID do aluno (opcional)','text',false],['turmaId','Turma','text',true],['nota','Nota (0 a 10)','number',false],['faltas','Quantidade de faltas','number',true],['observacoes','Observações','textarea',false]], columns:[['nome','Aluno'],['turmaId','Turma'],['nota','Nota'],['faltas','Faltas'],['observacoes','Observações']] }
};
const empty = { nome:'', email:'', telefone:'', cursoId:'', professorId:'', alunoId:'', turmaId:'', dataInicio:'', horario:'', status:'Ativo', nota:'', faltas:0, observacoes:'' };
export default function ModuloRegistros({ tipo }) {
  const cfg = configs[tipo];
  const apiTipo = tipo === 'notas-faltas' ? 'notas' : tipo;
  const [rows,setRows] = useState([]);
  const [form,setForm] = useState(empty);
  const [editId,setEditId] = useState(null);
  const [busy,setBusy] = useState(false);
  const [message,setMessage] = useState('');
  const [error,setError] = useState(false);
  const [query,setQuery] = useState('');
  const [showForm,setShowForm] = useState(false);

  async function load() {
    const r = await fetch(`/api/registros?tipo=${apiTipo}`);
    const d = await r.json();
    if (r.ok) setRows(d.registros || []); else { setMessage(d.mensagem || 'Não foi possível carregar.'); setError(true); }
  }
  useEffect(()=>{ load(); },[tipo]);
  const filtered = useMemo(()=>rows.filter(r=>JSON.stringify(r).toLowerCase().includes(query.toLowerCase())),[rows,query]);
  function startEdit(row) {
    setEditId(row._id);
    const next = { ...empty };
    Object.keys(next).forEach(k=>{ if(row[k] !== undefined && row[k] !== null) next[k] = row[k]; });
    setForm(next); setShowForm(true); setMessage(''); setError(false);
  }
  function newForm() { setEditId(null); setForm(empty); setShowForm(true); setMessage(''); setError(false); }
  async function save(e) {
    e.preventDefault(); setBusy(true); setMessage(''); setError(false);
    const payload = { ...form, tipo:apiTipo };
    if (payload.nota === '') payload.nota = null; else if (payload.nota !== null) payload.nota = Number(payload.nota);
    payload.faltas = Number(payload.faltas || 0);
    const r = await fetch(editId ? `/api/registros/${editId}` : '/api/registros', { method:editId?'PUT':'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
    const d = await r.json();
    setBusy(false);
    if (!r.ok) { setMessage(d.mensagem || 'Não foi possível salvar.'); setError(true); return; }
    setMessage(d.mensagem || 'Salvo com sucesso.'); setShowForm(false); setForm(empty); setEditId(null); await load();
  }
  async function remove(row) {
    if (!confirm(`Excluir "${row.nome}"?`)) return;
    const r = await fetch(`/api/registros/${row._id}`,{method:'DELETE'});
    const d = await r.json();
    setMessage(d.mensagem || 'Operação concluída.'); setError(!r.ok);
    if(r.ok) await load();
  }
  return <>
    <div className="section-head"><h2>{cfg.icon} {cfg.title} <span className="muted">({rows.length})</span></h2><button className="btn btn-primary" onClick={newForm}>＋ Novo cadastro</button></div>
    {message && <div className={`message ${error?'error':''}`}>{message}</div>}
    {showForm && <form className="form-card" onSubmit={save} style={{marginBottom:22}}>
      <div className="section-head" style={{marginTop:0}}><h2>{editId?'Editar':'Novo'} {cfg.singular}</h2><button type="button" className="btn btn-secondary" onClick={()=>setShowForm(false)}>Fechar</button></div>
      <div className="form-grid">{cfg.fields.map(([key,label,type,required,options])=><div className={`field ${type==='textarea'?'full':''}`} key={key}><label>{label}{required?' *':''}</label>
        {type==='textarea'?<textarea className="input" rows="3" required={required} value={form[key]??''} onChange={e=>setForm({...form,[key]:e.target.value})}/>:
        type==='select'?<select className="input" required={required} value={form[key]||options[0]} onChange={e=>setForm({...form,[key]:e.target.value})}>{options.map(o=><option key={o}>{o}</option>)}</select>:
        <input className="input" type={type} required={required} min={key==='nota'?0:key==='faltas'?0:undefined} max={key==='nota'?10:undefined} step={key==='nota'?'0.1':undefined} value={form[key]??''} onChange={e=>setForm({...form,[key]:e.target.value})}/>}
      </div>)}</div>
      <div className="form-actions"><button type="button" className="btn btn-secondary" onClick={()=>setShowForm(false)}>Cancelar</button><button className="btn btn-primary" disabled={busy}>{busy?'Salvando...':'Salvar cadastro'}</button></div>
    </form>}
    <div className="toolbar"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={`Pesquisar ${cfg.title.toLowerCase()}...`}/><button className="btn btn-secondary" onClick={load}>↻ Atualizar</button></div>
    <div className="table-wrap"><table className="data-table"><thead><tr>{cfg.columns.map(c=><th key={c[0]}>{c[1]}</th>)}<th>Ações</th></tr></thead><tbody>
      {filtered.map(row=><tr key={row._id}>{cfg.columns.map(([key])=><td key={key}>{key==='nota' && (row[key]===null || row[key]===undefined)?'—':(row[key]??'—')}</td>)}<td><div className="actions"><button className="btn btn-secondary btn-small" onClick={()=>startEdit(row)}>Editar</button><button className="btn btn-danger btn-small" onClick={()=>remove(row)}>Excluir</button></div></td></tr>)}
      {!filtered.length && <tr><td colSpan={cfg.columns.length+1}><div className="empty"><strong>Nenhum registro encontrado</strong>Cadastre o primeiro item ou altere a pesquisa.</div></td></tr>}
    </tbody></table></div>
  </>;
}
