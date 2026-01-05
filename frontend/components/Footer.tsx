
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1 text-left">
            <span className="text-2xl font-bold text-indigo-600">Evelou</span>
            <p className="mt-4 text-gray-500 text-sm leading-relaxed">
              A maior plataforma de eventos da América Latina. Crie, publique e venda seus ingressos com total segurança e profissionalismo.
            </p>
          </div>
          
          <div className="text-left">
            <h4 className="font-semibold text-gray-900 mb-4 uppercase text-[10px] tracking-[0.2em]">Plataforma</h4>
            <ul className="space-y-2 text-sm text-gray-500 font-medium">
              <li><Link to="/eventos" className="hover:text-indigo-600 transition">Explorar Eventos</Link></li>
              <li><Link to="/organizador/eventos/novo" className="hover:text-indigo-600 transition">Criar Evento</Link></li>
              <li><Link to="/afiliados" className="hover:text-indigo-600 transition">Programa de Afiliados</Link></li>
              <li><Link to="/login" className="hover:text-indigo-600 transition">Entrar na Conta</Link></li>
            </ul>
          </div>
          
          <div className="text-left">
            <h4 className="font-semibold text-gray-900 mb-4 uppercase text-[10px] tracking-[0.2em]">Jurídico</h4>
            <ul className="space-y-2 text-sm text-gray-500 font-medium">
              <li><Link to="/termos" className="hover:text-indigo-600 transition">Termos de Uso</Link></li>
              <li><Link to="/privacidade" className="hover:text-indigo-600 transition">Privacidade</Link></li>
              <li><Link to="/regras-de-estorno" className="hover:text-indigo-600 transition">Regras de Estorno</Link></li>
            </ul>
          </div>
          
          <div className="text-left">
            <h4 className="font-semibold text-gray-900 mb-4 uppercase text-[10px] tracking-[0.2em]">Suporte</h4>
            <ul className="space-y-2 text-sm text-gray-500 font-medium">
              <li><Link to="/ajuda" className="hover:text-indigo-600 transition">Central de Ajuda</Link></li>
              <li><Link to="/contato" className="hover:text-indigo-600 transition">Contato Comercial</Link></li>
            </ul>
            <div className="mt-6 flex gap-4">
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition"><i className="fa-brands fa-instagram text-xl"></i></a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition"><i className="fa-brands fa-facebook text-xl"></i></a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition"><i className="fa-brands fa-twitter text-xl"></i></a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t text-center text-gray-400 text-[10px] font-black uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Evelou Ingressos S.A. CNPJ 00.000.000/0001-00. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};
