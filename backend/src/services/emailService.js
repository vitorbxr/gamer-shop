// backend/src/services/emailService.js
import { Resend } from 'resend';
import { logService } from './logService.js';

const resend = new Resend(process.env.RESEND_API_KEY);

const getStatusMessage = (status) => {
  switch (status) {
    case 'PENDING':
      return {
        title: 'Pedido Recebido',
        message: 'Seu pedido foi recebido e está aguardando processamento.'
      };
    case 'PROCESSING':
      return {
        title: 'Pedido em Processamento',
        message: 'Seu pedido está sendo processado por nossa equipe.'
      };
    case 'AWAITING_PAYMENT':
      return {
        title: 'Aguardando Pagamento',
        message: 'Estamos aguardando a confirmação do seu pagamento para dar continuidade ao pedido.'
      };
    case 'PAID':
      return {
        title: 'Pagamento Confirmado',
        message: 'O pagamento do seu pedido foi confirmado! Estamos preparando o envio.'
      };
    case 'SHIPPED':
      return {
        title: 'Pedido Enviado',
        message: 'Ótimas notícias! Seu pedido foi enviado e está a caminho.'
      };
    case 'DELIVERED':
      return {
        title: 'Pedido Entregue',
        message: 'Seu pedido foi entregue! Esperamos que você esteja satisfeito com sua compra.'
      };
    case 'CANCELLED':
      return {
        title: 'Pedido Cancelado',
        message: 'Seu pedido foi cancelado. Se tiver dúvidas, entre em contato conosco.'
      };
    default:
      return {
        title: 'Atualização do Pedido',
        message: 'Houve uma atualização no status do seu pedido.'
      };
  }
};

export const emailTemplates = {
  orderConfirmation: (order, user) => ({
    subject: `GamerShop - Confirmação do Pedido #${order.id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Olá ${user.name}!</h1>
        <p>Obrigado por comprar na GamerShop! Seu pedido foi recebido com sucesso.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: #444;">Pedido #${order.id}</h2>
          <p>Status: <strong>${order.status}</strong></p>
          
          <h3>Itens do Pedido:</h3>
          <ul style="list-style: none; padding: 0;">
            ${order.items.map(item => `
              <li style="margin-bottom: 10px;">
                <div>${item.product.name}</div>
                <div>Quantidade: ${item.quantity}</div>
                <div>Preço: €${item.price.toFixed(2)}</div>
              </li>
            `).join('')}
          </ul>
          
          <p style="font-size: 18px; margin-top: 20px;">
            <strong>Total: €${order.totalAmount.toFixed(2)}</strong>
          </p>
        </div>

        ${order.shipping ? `
          <div style="margin-top: 20px;">
            <h3>Endereço de Entrega:</h3>
            <p>${order.shipping.address}</p>
            <p>${order.shipping.postalCode} - ${order.shipping.city}</p>
            <p>${order.shipping.district}</p>
          </div>
        ` : ''}

        ${order.payment?.method === 'MULTIBANCO' ? `
          <div style="margin-top: 20px; background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            <h3>Dados para Pagamento Multibanco</h3>
            <p><strong>Entidade:</strong> ${order.payment.entity}</p>
            <p><strong>Referência:</strong> ${order.payment.reference}</p>
            <p><strong>Valor:</strong> €${order.payment.amount.toFixed(2)}</p>
          </div>
        ` : ''}
        
        <div style="margin-top: 30px; color: #666;">
          <p>Se tiver alguma dúvida sobre seu pedido, entre em contato conosco.</p>
          <p>Atenciosamente,<br>Equipe GamerShop</p>
        </div>
      </div>
    `
  }),
  
  orderStatusUpdate: (order, user) => {
    const statusInfo = getStatusMessage(order.status);
    const isDelivered = order.status === 'DELIVERED';

    return {
      subject: `GamerShop - ${statusInfo.title} - Pedido #${order.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Olá ${user.name}!</h1>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #444;">${statusInfo.title}</h2>
            <p>${statusInfo.message}</p>
            
            <div style="margin-top: 15px;">
              <strong>Pedido:</strong> #${order.id}<br>
              <strong>Status:</strong> ${order.status}
              ${order.shipping?.trackingCode ? `
                <br><strong>Código de Rastreio:</strong> ${order.shipping.trackingCode}
              ` : ''}
            </div>
          </div>

          ${isDelivered ? `
            <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #2e7d32;">Avalie sua Compra!</h3>
              <p>Sua opinião é muito importante para nós. Que tal avaliar os produtos que você recebeu?</p>
              <p>Para avaliar, basta acessar seu histórico de pedidos em nossa loja e clicar no botão "Avaliar" ao lado dos produtos deste pedido.</p>
              <a href="http://localhost:5173/orders" style="display: inline-block; background-color: #2e7d32; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Ver Meus Pedidos</a>
            </div>
          ` : ''}
          
          <div style="margin-top: 30px; color: #666;">
            <p>Se tiver alguma dúvida sobre seu pedido, entre em contato conosco.</p>
            <p>Atenciosamente,<br>Equipe GamerShop</p>
          </div>
        </div>
      `
    };
  }
};

class EmailService {
  async sendEmail(to, template, data) {
    try {
      console.log('Preparando para enviar email:', {
        to,
        data: JSON.stringify(data, null, 2)
      });

      const { subject, html } = template(data.order, data.user);
      
      console.log('Template processado:', { subject, htmlLength: html.length });

      const response = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to,
        subject,
        html
      });

      console.log('Resposta do Resend:', response);
      logService.info('Email enviado com sucesso', { messageId: response.id });

      return { success: true, messageId: response.id };
    } catch (error) {
      console.error('Erro detalhado ao enviar email:', {
        error: error.message,
        stack: error.stack,
        data: error.data
      });
      logService.error('Falha ao enviar email', error);
      throw new Error('Falha ao enviar email: ' + error.message);
    }
  }

  async sendOrderConfirmation(order, user) {
    console.log('Iniciando envio de confirmação de pedido:', {
      orderId: order.id,
      userId: user.id,
      userEmail: user.email
    });

    return this.sendEmail(
      user.email,
      emailTemplates.orderConfirmation,
      { order, user }
    );
  }

  async sendOrderStatusUpdate(order, user) {
    console.log('Iniciando envio de atualização de status:', {
      orderId: order.id,
      userId: user.id,
      userEmail: user.email,
      newStatus: order.status
    });

    return this.sendEmail(
      user.email,
      emailTemplates.orderStatusUpdate,
      { order, user }
    );
  }
}

export default new EmailService();