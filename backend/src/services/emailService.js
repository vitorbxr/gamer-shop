// backend/src/services/emailService.js
import { Resend } from 'resend';
import { logService } from './logService.js';

// Inicializa o cliente Resend com a API key
const resend = new Resend(process.env.RESEND_API_KEY);

const EmailService = {
  sendOrderConfirmation: async (order, user) => {
    const subject = `Confirmação do Pedido #${order.id}`;
    
    // Formata os itens do pedido para o email
    const orderItems = order.items.map(item => {
      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(item.price)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(item.price * item.quantity)}</td>
        </tr>
      `;
    }).join('');

    // Informações de pagamento baseadas no método
    let paymentInfo = '';
    if (order.payment.method === 'MULTIBANCO') {
      paymentInfo = `
        <div style="margin-top: 20px; padding: 15px; background-color: #f7f7f7; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #333;">Dados para Pagamento Multibanco</h3>
          <p><strong>Entidade:</strong> ${order.payment.entity}</p>
          <p><strong>Referência:</strong> ${order.payment.reference}</p>
          <p><strong>Valor:</strong> ${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(order.payment.amount)}</p>
          <p>Por favor, efetue o pagamento dentro de 48 horas para garantir o processamento do seu pedido.</p>
        </div>
      `;
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Confirmação de Pedido</h2>
        <p style="margin-bottom: 15px;">Olá ${user.name},</p>
        <p style="margin-bottom: 15px;">Obrigado pela sua compra! O seu pedido foi recebido e está sendo processado.</p>
        
        <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">Detalhes do Pedido #${order.id}</h3>
          <p><strong>Data:</strong> ${new Date(order.createdAt).toLocaleDateString('pt-PT')}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          
          <h4 style="margin-bottom: 10px;">Itens:</h4>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #eee;">
                <th style="padding: 10px; text-align: left;">Produto</th>
                <th style="padding: 10px; text-align: center;">Qtd</th>
                <th style="padding: 10px; text-align: right;">Preço</th>
                <th style="padding: 10px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderItems}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
                <td style="padding: 10px; text-align: right;">${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(order.totalAmount)}</td>
              </tr>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Frete:</strong></td>
                <td style="padding: 10px; text-align: right;">${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(order.shipping.cost)}</td>
              </tr>
              ${order.discountAmount ? `
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Desconto:</strong></td>
                <td style="padding: 10px; text-align: right;">- ${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(order.discountAmount)}</td>
              </tr>
              ` : ''}
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
                <td style="padding: 10px; text-align: right; font-weight: bold;">${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(order.totalAmount + order.shipping.cost - (order.discountAmount || 0))}</td>
              </tr>
            </tfoot>
          </table>
          
          <div style="margin-top: 20px;">
            <h4 style="margin-bottom: 10px;">Endereço de Entrega:</h4>
            <p style="margin: 0;">${order.shipping.address}</p>
            <p style="margin: 0;">${order.shipping.city}, ${order.shipping.district}</p>
            <p style="margin: 0;">${order.shipping.postalCode}</p>
            <p style="margin: 0;">${order.shipping.country}</p>
          </div>
          
          <div style="margin-top: 20px;">
            <h4 style="margin-bottom: 10px;">Método de Pagamento:</h4>
            <p>${order.payment.method.replace('_', ' ')}</p>
          </div>
          
          ${paymentInfo}
        </div>
        
        <p style="margin-bottom: 15px;">
          Você receberá atualizações sobre o status do seu pedido por email. Se tiver alguma dúvida, por favor, entre em contato conosco.
        </p>
        
        <p style="color: #777; font-size: 0.9em;">
          Atenciosamente,<br>
          Equipe GamerShop
        </p>
      </div>
    `;

    try {
      const data = await resend.emails.send({
        from: 'GamerShop <onboarding@resend.dev>',
        to: user.email,
        subject,
        html
      });
      
      logService.info('Email de confirmação enviado', { 
        orderId: order.id, 
        userId: user.id, 
        email: user.email 
      });
      
      return data;
    } catch (error) {
      logService.error('Erro ao enviar email de confirmação', error);
      throw error;
    }
  },

  sendOrderStatusUpdate: async (order, user) => {
    const subject = `Atualização do Pedido #${order.id}`;
    
    // Texto específico baseado no status
    let statusText = '';
    let emailTitle = 'Atualização do Pedido';
    
    switch (order.status) {
      case 'PROCESSING':
        statusText = 'Seu pedido está em processamento. Estamos preparando os itens para envio.';
        break;
      case 'SHIPPED':
        statusText = 'Seu pedido foi enviado!';
        break;
      case 'DELIVERED':
        statusText = 'Seu pedido foi entregue! Esperamos que você esteja aproveitando seus produtos.';
        break;
      case 'CANCELLED':
        statusText = 'Infelizmente, seu pedido foi cancelado. Entre em contato com nosso suporte para mais informações.';
        break;
      case 'DADOS_ATUALIZADOS':
        emailTitle = 'Dados do Pedido Atualizados';
        statusText = 'Os dados do seu pedido foram atualizados conforme solicitado.';
        break;
      default:
        statusText = `Seu pedido foi atualizado para: ${order.status}`;
    }
  
    // Formatação de itens do pedido (apenas para status DADOS_ATUALIZADOS, usando o mesmo formato do email de confirmação)
    let orderItemsHTML = '';
    
    if (order.status === 'DADOS_ATUALIZADOS') {
      const orderItems = order.items.map(item => {
        return `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(item.price)}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(item.price * item.quantity)}</td>
          </tr>
        `;
      }).join('');
  
      orderItemsHTML = `
        <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px;">
          <h4 style="margin-bottom: 10px; color: #333;">Resumo do Pedido:</h4>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #eee;">
                <th style="padding: 10px; text-align: left;">Produto</th>
                <th style="padding: 10px; text-align: center;">Qtd</th>
                <th style="padding: 10px; text-align: right;">Preço</th>
                <th style="padding: 10px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderItems}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
                <td style="padding: 10px; text-align: right;">${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(order.totalAmount)}</td>
              </tr>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Frete:</strong></td>
                <td style="padding: 10px; text-align: right;">${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(order.shipping.cost)}</td>
              </tr>
              ${order.discountAmount ? `
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Desconto:</strong></td>
                <td style="padding: 10px; text-align: right;">- ${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(order.discountAmount)}</td>
              </tr>
              ` : ''}
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
                <td style="padding: 10px; text-align: right; font-weight: bold;">${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(order.totalAmount + order.shipping.cost - (order.discountAmount || 0))}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      `;
    } else {
      // Versão simplificada para outros status
      orderItemsHTML = `
        <h4 style="margin: 15px 0 10px;">Resumo do Pedido:</h4>
        <ul style="list-style-type: none; padding: 0;">
          ${order.items.map(item => `
            <li style="margin-bottom: 10px;">
              ${item.quantity}x ${item.product.name} - ${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(item.price * item.quantity)}
            </li>
          `).join('')}
        </ul>
        <p style="margin-top: 15px;"><strong>Total:</strong> ${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(order.totalAmount)}</p>
      `;
    }
  
    // Informações de rastreio para status SHIPPED
    let regularTrackingInfo = '';
    if (order.status === 'SHIPPED' && order.shipping.trackingCode) {
      regularTrackingInfo = `
        <div style="margin-top: 15px; padding: 10px; background-color: #e8f4fd; border-radius: 5px;">
          <h4 style="margin-top: 0; color: #0056b3;">Informações de Rastreio</h4>
          <p><strong>Código de Rastreio:</strong> ${order.shipping.trackingCode}</p>
          <p>Você pode acompanhar seu pedido através do site dos CTT usando este código.</p>
        </div>
      `;
    }
  
    // Endereço de entrega (apenas para DADOS_ATUALIZADOS)
    let shippingAddress = '';
    if (order.status === 'DADOS_ATUALIZADOS') {
      shippingAddress = `
        <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px;">
          <h4 style="margin-bottom: 10px; color: #333;">Endereço de Entrega:</h4>
          <p style="margin: 0;">${order.shipping.address}</p>
          <p style="margin: 0;">${order.shipping.city}${order.shipping.district ? `, ${order.shipping.district}` : ''}</p>
          <p style="margin: 0;">${order.shipping.postalCode}</p>
          <p style="margin: 0;">${order.shipping.country}</p>
        </div>
      `;
    }
  
    // Informações de rastreio (apenas para DADOS_ATUALIZADOS)
    let trackingInfo = '';
    if (order.status === 'DADOS_ATUALIZADOS') {
      trackingInfo = `
        <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px;">
          <h4 style="margin-bottom: 10px; color: #333;">Código de Rastreio:</h4>
          ${order.shipping.trackingCode 
            ? `<p style="margin: 0;"><strong>${order.shipping.trackingCode}</strong></p>
               <p style="margin: 5px 0 0 0; font-size: 0.9em;">Você pode acompanhar seu pedido através do site dos CTT usando este código.</p>`
            : `<p style="margin: 0;">Este pedido ainda não possui código de rastreio.</p>`
          }
        </div>
      `;
    }
  
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">${emailTitle}</h2>
        <p style="margin-bottom: 15px;">Olá ${user.name},</p>
        <p style="margin-bottom: 15px;">
          ${order.status === 'DADOS_ATUALIZADOS' 
            ? 'Os dados do seu pedido foram atualizados conforme solicitado.' 
            : 'Temos novidades sobre o seu pedido.'}
        </p>
        
        <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">
            ${order.status === 'DADOS_ATUALIZADOS' 
              ? `Pedido #${order.id} Atualizado`
              : `Status: ${order.status}`}
          </h3>
          <p>${statusText}</p>
          
          ${order.status === 'DADOS_ATUALIZADOS' ? shippingAddress : ''}
          ${order.status === 'DADOS_ATUALIZADOS' ? trackingInfo : regularTrackingInfo}
          
          ${orderItemsHTML}
        </div>
        
        <p style="margin-bottom: 15px;">
          Se tiver alguma dúvida sobre seu pedido, por favor entre em contato conosco.
        </p>
        
        <p style="color: #777; font-size: 0.9em;">
          Atenciosamente,<br>
          Equipe GamerShop
        </p>
      </div>
    `;
  
    try {
      const data = await resend.emails.send({
        from: 'GamerShop <onboarding@resend.dev>',
        to: user.email,
        subject,
        html
      });
      
      logService.info('Email de atualização de status enviado', { 
        orderId: order.id, 
        userId: user.id, 
        email: user.email,
        status: order.status
      });
      
      return data;
    } catch (error) {
      logService.error('Erro ao enviar email de atualização de status', error);
      throw error;
    }
  }
};

export default EmailService;